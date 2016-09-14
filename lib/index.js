"use strict";

var createFolders = require('./create-folders');
var createFiles = require('./create-files');
var writeFiles = require('./write-files');
var createModels = require('./create-models');
var npminit = require('./npm-init');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var inquirer = require('inquirer');
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
  },{
    name: "entry",
    message: "Entry point: ",
    default: "server.js"
  },{
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
  }])
  .then(function(answers){
    npminit(answers)
    .then(createFolders)
    .then(()=>createFiles(answers.entry))
    .then(writeFiles)
    .then(function(){
      console.log(chalk.yellow.bold("Finished creating project"));
      if(process.env.PATH){
        console.log(chalk.green.bold("Doing npm install"));
        var child = exec('npm install', function(err, stdout, stderr){
          console.log(chalk.green.bold("Finished doing npm install"));
          console.log(chalk.green("Start the app using \'npm start\'"))
          process.exit(0);
        })
        .stdout.pipe(process.stdout);
      }
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

var setupModel = function(modelName){
  createModels(modelName)
  .then(function(){
    console.log(chalk.yellow.bold("Finished creating model: "+modelName));
    process.exit(0);
  });
}

exports.setup = setup;
exports.model = setupModel;
