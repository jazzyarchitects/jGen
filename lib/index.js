"use strict";

var createFolders = require('./create-folders');
var createFiles = require('./create-files');
var writeFiles = require('./write-files');
var removeModels = require('./remove-models');
var npminit = require('./npm-init');
var inquirer = require('inquirer');
var scripts = require('./init-scripts');
var fixFiles = require('./fix-files');
var chalk = require('chalk');
var path = require('path');
var tree = require('./tree');
var fs = require('fs');


var initialiseProject = function(){
  var dirs = process.cwd().split(/[/\\]/);
  var currentDir = dirs[dirs.length -1 ];

  inquirer.prompt([{
    name: "name",
    message: "Project name: ",
    default: currentDir
  },{
    name: "version",
    message: "Version: ",
    default: "1.0.0",
    validate: function(ip){
      var done = this.async();
      var arrs = ip.split(".");
      if(arrs.length !== 2 && arrs.length!== 3){
        return done("Invalid version number", false);
      }
      for(var it of arrs){
        try{
          var p = Number(it);
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
  {
    name: "entry",
    message: "Entry point: ",
    default: "server.js"
  },
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
    npminit(answers)
    .then(createFolders)
    .then(()=>createFiles(answers.entry))
    .then(writeFiles)
    .then(scripts)
    .then(function(){
      process.exit(0);
    });
  });
}


var __setup = function(){

  var packagePath = path.join(".","package.json");

  if(fs.existsSync(packagePath)){
    try{
      var content = JSON.parse(fs.readFileSync(packagePath).toString());
      var width = process.stdout.columns;
      var str = "NPM project \""+content.name+"\" already exists in this location. Continuing will overwrite this project.";
      var len = str.length;
      var space = "";
      for(var i=0;i<(width-len)/2;i++){
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
      initialiseProject();
    }
  }else{
    initialiseProject();
  }
};


var __fix = function(){
  try{
    var config = fs.readFileSync(path.join(process.cwd(), "package.json"));
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

var __removeModels = function(models){
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

var __showModels = function(){
  var modulePath = path.join(process.cwd(), "modules");
  console.log(chalk.cyan("\t\t\t__________________________________"));
  console.log(chalk.cyan("\t\t\t|Following models are in this app|"));
  var len = "|Following models are in this app|".length;
  console.log(chalk.cyan("\t\t\t|================================|"));
  fs.readdirSync(modulePath).forEach((dir)=>{
    var strLen = len-6-dir.length;
    var str = "";
    for(var i=0;i<strLen;i++){
      str += " ";
    }
    console.log("\t\t\t"+chalk.cyan("|")+chalk.yellow("->  "+dir[0].toUpperCase()+dir.substring(1,dir.length))+str+chalk.cyan("|"));
  });

  console.log(chalk.cyan("\t\t\t==================================\n"));
  process.exit(0);
}


var log = color?chalk[color]:chalk.blue;
var logBold = color?chalk[color].bold:chalk.cyan.bold;
var __tree = function(root){
  if(typeof(root)==="object"){
    root.forEach((r)=>{
      console.log(logBold(r));
      tree(r);
      console.log(chalk.blue("---------------------------------------------------"));
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
