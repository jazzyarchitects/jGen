"use strict";

var createFolders = require('./create-folders');
var createFiles = require('./create-files');
var writeFiles = require('./write-files');
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

module.exports = setup;
