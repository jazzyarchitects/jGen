"use strict";

var createFolders = require('./create-folders');
var createFiles = require('./create-files');
var writeFiles = require('./write-files');
var createModels = require('./create-models');
var chalk = require('chalk');

var setup = function(){
  createFolders()
  .then(createFiles)
  .then(writeFiles)
  .then(function(){
    console.log(chalk.yellow.bold("Finished creating project"));
    process.exit(0);
  });
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
