"use strict";

var chalk = require('chalk');
var async = require('async');
var inquirer = require('inquirer');
var createModels = require('./create-models');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var __answers = {};

var predefinedModels = ['none','user'];

var fieldTypeStrings = [
"String",
"Number",
"Date",
"Buffer",
"Boolean",
"Schema.Types.Mixed",
"Schema.Types.Objectid",
"Array"
];

var modelProperties = [];

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

    __answers = answers;
    console.log(chalk.blue("-------------------Define model properties------------------"));
    console.log(chalk.red("Warning: Do NOT press Ctrl+C to exit the wizard. Progress will be lost."));
    getModelFields();
  });
}

function done(){
  createModels(__answers, __answers.baseModel)
  .then(function(){
    console.log(chalk.green.bold("Finished creating model: "+__answers.modelName));
    console.log(chalk.yellow("You can edit this model properties by modifying /modules/"+__answers.modelName+"/models/"+__answers.modelName+".js"));
    console.log(chalk.yellow("Refer "+chalk.bold("http://mongoosejs.com/docs/schematypes.html")+" for information on defining Schema properties"));
    process.exit(0);
  });
}

function getModelFields(){
  inquirer.prompt([{
    name: "name",
    message: "Field Name (leave blank to exit)"
  }])
  .then((ans)=>{
    if(!ans.name){
      return done();
    }
    getFieldInformation(ans.name);
  });
}

function getFieldInformation(name){
  console.log(chalk.magenta("Define "+name+" field"));
  inquirer.prompt([{
    name: "type",
    message: "Type",
    type: "list",
    choices: fieldTypeStrings
  },{
    name: "required",
    message: "Is compulsary field?",
    type: "confirm",
    default: false
  },{
    name: "unique",
    message: "Should it be unique field?",
    type: "confirm",
    default: false
  },{
    name: "def",
    message: "Default value (if any)"
  }])
  .then((answers)=>{
    if(answers.type==="Array"){
      getArrayType()
      .then((t)=>{
        answers.type = ["__**__;"+t+"__**__;"];
        return processAnswers(name, answers);
      });
    }else{
      // if(answers.def!==undefined){
      //   eval("answers.def = "+answers.type+"("+answers.def+")");
      // }
      // console.log(answers);
      if(answers.def.length!==0){
        if(answers.type==="Number"){
          answers.def = Number(answers.def);
        }
      }
      answers.type = "__**__;"+answers.type+"__**__;";
      return processAnswers(name, answers);
    }
  })
}

function getArrayType(){
  return new Promise(function(resolve, reject){
    inquirer.prompt([{
      name: "t",
      message: "Which type of array is it?",
      type: "list",
      choices: fieldTypeStrings.splice(0,fieldTypeStrings.length-1)
    }])
    .then((a)=>{
      return resolve(a.t);
    });
  });
}

function processAnswers(name, answers){
  var obj = {
    name: name,
    "type": answers.type
  };
  if(answers.required){
    obj.required = answers.required;
  }
  if(answers.unique){
    obj.unique = answers.unique;
  }
  if(answers.def){
    obj["default"] = answers.def;
  }

  if(!__answers.modelProperties){
    __answers.modelProperties = [];
  }
  __answers.modelProperties.push(obj);
  getModelFields();
}

module.exports = setupModel;
