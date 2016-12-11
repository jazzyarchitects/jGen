"use strict";

const createFolders = require('./create-folders');
const createFiles = require('./create-files');
const writeFiles = require('./write-files');
const removeModels = require('./remove-models');
const npminit = require('./npm-init');
const inquirer = require('inquirer');
const scripts = require('./init-scripts');
const fixFiles = require('./fix-files');
const chalk = require('chalk');
const path = require('path');
const tree = require('./tree');
const fs = require('fs');


let initialiseProject = function(file){
  let dirs = process.cwd().split(/[/\\]/);
  let currentDir = dirs[dirs.length -1 ];

  if(file){
    let npmconfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), file)).toString());
    npminit(npmconfig)
    .then(createFolders)
    .then(()=>createFiles(npmconfig.entry))
    .then(writeFiles)
    .then(scripts)
    .then(function(){
      process.exit(0);
    });
    return;
  }
  inquirer.prompt([{
    name: "name",
    message: "Project name: ",
    default: currentDir
  },{
    name: "version",
    message: "Version: ",
    default: "1.0.0",
    validate: function(ip){
      let done = this.async();
      let arrs = ip.split(".");
      if(arrs.length !== 2 && arrs.length!== 3){
        return done("Invalid version number", false);
      }
      for(let it of arrs){
        try{
          let p = Number(it);
        }catch(err){
          return done("Invalid version number", false);
        }
      }
      return done(null, true);
    }
  },{
    name: "description",
    message: "Description: ",
  },
  // {
  //   name: "entry",
  //   message: "Entry point: ",
  //   default: "server.js"
  // },
  {
    name: "test",
    message: "Test Command: "
  },{
    name: "git",
    message: "Git repository: "
  },{
    name: "keywords",
    message: "Keywords: "
  },{
    name: "author",
    message: "Author: "
  },{
    name: "license",
    message: "License: ",
    default: "ISC"
  },{
    name: "database",
    message: "Database Name: ",
    default: currentDir
  }])
  .then(function(answers){
    answers.entry = "server.js";
    // console.log(answers);
    npminit(answers)
    .then(createFolders)
    .then(()=>createFiles(answers.entry))
    .then(writeFiles)
    .then(scripts)
    .then(function(){
      console.log(chalk.red.bold("DO NOT use forever with WATCH flag. App code takes care of it"));
      console.log(chalk.yellow("If app crashes with error ENOSPC, execute this: "+chalk.bold("$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p")));
      console.log(chalk.yellow("For non-ubuntu systems: Change file watch limit on your system or uncomment line in server.js"));
      process.exit(0);
    });
  });
}


let __setup = function(file){
  // console.log(file);
  let packagePath = path.join(".","package.json");

  if(fs.existsSync(packagePath)){
    try{
      let content = JSON.parse(fs.readFileSync(packagePath).toString());
      let width = process.stdout.columns;
      let str = "NPM project \""+content.name+"\" already exists in this location. Continuing will overwrite this project.";
      let len = str.length;
      let space = "";
      for(let i=0;i<(width-len)/2;i++){
        space += " ";
      }
      console.log(chalk.red.bgWhite.bold((space+str+space).substring(0, width)));
      inquirer.prompt({
        name: "ans",
        message: "Continue (Yes/No)?",
        default: "No"
      })
      .then(function(answers){
        if(answers.ans.toLowerCase()==="yes" || answers.ans.toLowerCase()==="y"){
          return initialiseProject();
        }
        console.log(chalk.red("Aborted by user"));
        process.exit(0);
      })
    }catch(err){
      initialiseProject(file);
    }
  }else{
    initialiseProject(file);
  }
};


let __fix = function(){
  try{
    let config = fs.readFileSync(path.join(process.cwd(), "package.json"));
    config = JSON.parse(config);
  }catch(err){
    console.log(chalk.red("Error: Kindly do jgen init if project is not setup"));
  }
  createFolders()
  .then(()=>fixFiles(config))
  .then(()=>{
    console.log(chalk.green("Project structure fixed"));
    process.exit(0);
  })
}

let __removeModels = function(models){
  inquirer.prompt([{
    name: "result",
    message: "Confirm remove following models. "+chalk.red("This cannot be undone..!!!")+"\n"+chalk.cyan(models.join(",")),
    type: "confirm",
    default: false
  }])
  .then((ans)=>{
    if(ans.result){
      removeModels(models);
    }else{
      console.log(chalk.red("Aborted by user"));
      process.exit(0);
    }
  });
}

let __showModels = function(){
  let modulePath = path.join(process.cwd(), "modules");
  if(!fs.existsSync(modulePath)){
    console.log("  | "+chalk.red.bold("*modules* directory does not exists. Was this project created using jgen?")+" |");
    process.exit(0);
  }
  let len = "|Following models are in this app|".length;
  let name = npmconfig.name;
  let spaceString = "";
  for(let i=name.length;i<len-2;i++){
    spaceString+=" ";
  }
  console.log(chalk.cyan("\t\t\t__________________________________"));
  console.log(chalk.cyan("\t\t\t|"+chalk.bold(name[0].toUpperCase()+name.substring(1, name.length).replace("-"," "))+spaceString+"|"));
  console.log(chalk.cyan("\t\t\t|Following models are in this app|"));
  console.log(chalk.cyan("\t\t\t|================================|"));
  fs.readdirSync(modulePath).forEach((dir)=>{
    let strLen = len-6-dir.length;
    let str = "";
    let stat = fs.lstatSync(path.join(modulePath, dir));
    if(stat.isDirectory()){
      for(let i=0;i<strLen;i++){
        str += " ";
      }
      console.log("\t\t\t"+chalk.cyan("|")+chalk.yellow("->  "+dir[0].toUpperCase()+dir.substring(1,dir.length))+str+chalk.cyan("|"));
    }
  });

  console.log(chalk.cyan("\t\t\t==================================\n"));
  process.exit(0);
}


let log = color?chalk[color]:chalk.blue;
let logBold = color?chalk[color].bold:chalk.cyan.bold;
let __tree = function(root){
  console.log("");
  if(typeof(root)==="object"){
    root.forEach((r)=>{
      console.log("  "+logBold(r));

      if(r.indexOf(process.cwd())===-1){
        r = path.join(process.cwd(), r);
      }
      let __root = r.split("/").splice(0, r.split("/").length-1).join("/");
      // let __root = r;
      // console.log(r, __root);
      tree(r, __root);
      if(root.length>1){
        console.log(chalk.blue("---------------------------------------------------"));
      }
    });
  }else{
    root = process.cwd();
    tree(root);
  }
}



exports.setup = __setup;
exports.model = require('./setup-models');
exports.fix = __fix;
exports.removeModels = __removeModels;
exports.showModels = __showModels;
exports.tree = __tree;
