"use strict";

var createFolders = require('./create-folders');
var createFiles = require('./create-files');
var chalk = require('chalk');

var setup = function(){
  createFolders()
  .then(createFiles)
  .then(function(){
    console.log(chalk.yellow.bold("Finished creating project"));
    process.exit(0);
  });
};

module.exports = setup;
