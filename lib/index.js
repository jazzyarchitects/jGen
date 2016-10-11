"use strict";

var createFolders = require('./create-folders');
var createFiles = require('./create-files');
var writeFiles = require('./write-files');
var npminit = require('./npm-init');
var inquirer = require('inquirer');
var scripts = require('./init-scripts');
var fixFiles = require('./fix-files');
var chalk = require('chalk');
var path = require('path');
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


var setup = function(){

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


var fix = function(){
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

exports.setup = setup;
exports.model = require('./setup-models');
exports.fix = fix;
