"use strict";

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const createModels = require('./create-models');

let __answers = {};

const predefinedModels = ['none', 'user'];

const fieldTypeStrings = [
  "String",
  "Number",
  "Date",
  "Buffer",
  "Boolean",
  "Schema.Types.Mixed",
  "Schema.Types.Objectid",
  "Array"
];

let setupModel = function (modelName) {
  console.log(chalk.red("Warning: Do NOT press Ctrl+C to exit the wizard. Progress will be lost."));
  console.log(chalk.cyan.bold("Setup " + modelName + " model"));
  inquirer.prompt([{
    type: "confirm",
    name: "isPrivate",
    default: true,
    message: `Should this model have 'api' prefix in url? /api/${modelName} ?`
  }, {
    type: "list",
    name: "baseModel",
    choices: predefinedModels,
    message: "Extend existing models: ",
    default: 0
  }]).then((answers)=>{
    answers.modelName = modelName.toLowerCase();
    answers.isPrivate = !answers.isPrivate;

    __answers = answers;
    console.log(chalk.blue.bold("-------------------Define model properties------------------"));
    getModelFields();
  });
}

function done () {
  let jgenconfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'jgenconfig.json')).toString());

  if (!jgenconfig.apiModels) {
    jgenconfig.apiModels = [];
  }
  if (jgenconfig.apiModels.indexOf(__answers.modelName) !== -1) {
    jgenconfig.apiModels.splice(jgenconfig.apiModels.indexOf(__answers.modelName), 1);
  }
  if (!__answers.isPrivate) {
    jgenconfig.apiModels.push(__answers.modelName);
  }
  if (!jgenconfig.models) {
    jgenconfig.models = [];
  }
  if (jgenconfig.models.indexOf(__answers.modelName) !== -1) {
    jgenconfig.models.splice(jgenconfig.models.indexOf(__answers.modelName), 1);
  }
  jgenconfig.models.push(__answers.modelName);
  fs.writeFileSync(path.join(process.cwd(), 'jgenconfig.json'), JSON.stringify(jgenconfig, null, 2));
  createModels(__answers, __answers.baseModel)
  .then(function () {
    console.log(chalk.green("Finished creating model: " + chalk.bold(__answers.modelName)));
    console.log(chalk.yellow("You can edit this model properties by modifying /modules/" + __answers.modelName + "/models/" + __answers.modelName + ".js"));
    console.log(chalk.yellow("Refer " + chalk.bold("http://mongoosejs.com/docs/schematypes.html") + " for information on defining Schema properties"));
    process.exit(0);
  });
}

function getModelFields () {
  inquirer.prompt([{
    name: "name",
    message: "Field Name (leave blank to exit)"
  }])
  .then((ans)=>{
    if (!ans.name) {
      return done();
    }
    getFieldInformation(ans.name);
  });
}

function getFieldInformation (name) {
  console.log(chalk.magenta("Define " + chalk.bold(name) + " field"));
  inquirer.prompt([{
    name: "type",
    message: "Type",
    type: "list",
    choices: fieldTypeStrings
  }, {
    name: "required",
    message: "Is compulsary field?",
    type: "confirm",
    default: false
  }, {
    name: "unique",
    message: "Should it be unique field?",
    type: "confirm",
    default: false
  }, {
    name: "def",
    message: "Default value (if any)"
  }])
  .then((answers)=>{
    if (answers.type === "Array") {
      getArrayType()
      .then((t)=>{
        answers.type = ["__**__;" + t + "__**__;"];
        return processAnswers(name, answers);
      });
    } else {
      if (answers.def.length !== 0) {
        if (answers.type === "Number") {
          answers.def = Number(answers.def);
        }
      }
      answers.type = "__**__;" + answers.type + "__**__;";
      return processAnswers(name, answers);
    }
  })
}

function getArrayType () {
  return new Promise(function (resolve, reject) {
    inquirer.prompt([{
      name: "t",
      message: "Which type of array is it?",
      type: "list",
      choices: fieldTypeStrings.splice(0, fieldTypeStrings.length - 1)
    }])
    .then((a)=>{
      return resolve(a.t);
    });
  });
}

function processAnswers (name, answers) {
  let obj = {
    name: name,
    "type": answers.type
  };
  if (answers.required) {
    obj.required = answers.required;
  }
  if (answers.unique) {
    obj.unique = answers.unique;
  }
  if (answers.def) {
    obj["default"] = answers.def;
  }

  if (!__answers.modelProperties) {
    __answers.modelProperties = [];
  }
  __answers.modelProperties.push(obj);
  getModelFields();
}

module.exports = setupModel;
