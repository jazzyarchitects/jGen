"use strict";

var chalk = require('chalk');
var async = require('async');
var inquirer = require('inquirer');
var createModels = require('./create-models');

var predefinedModels = ['none','user'];

var setupModel = function(modelName){
  console.log(chalk.cyan.bold("Setup "+modelName+" model"));
  inquirer.prompt([{
    type: "confirm",
    name: "isPrivate",
    default: true,
    message: "Is this model api accessible?"
  },{
    type: "list",
    name: "baseModel",
    choices: predefinedModels,
    message: "Extend existing models: ",
    default: 0
  }]).then((answers)=>{
    answers.modelName = modelName;
    answers.isPrivate = !answers.isPrivate;
    answers.modelProperties = [{
      name: "College",
      "type": "String",
      required: true,
      "default": 'ISM',
      unique: false
    }];
    createModels(answers, answers.baseModel)
    .then(function(){
      console.log(chalk.yellow.bold("Finished creating model: "+modelName));
      process.exit(0);
    });
  });
}

module.exports = setupModel;
