"use strict";

var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var async = require('async');

var removeModels = function(models){
  async.forEachLimit(models, 5, function(model, _cb){
    var modelPath = path.join(process.cwd(), "modules", model);
    if(fs.existsSync(modelPath)){
      console.log(chalk.yellow("Removing model: "+chalk.bold(model)));
      removeFolder(modelPath);
    }else{
      console.log(chalk.red(chalk.bold(model)+" model does not exists. Skipping..."));
    }
    _cb();
  }, function(results){
    console.log(chalk.green("Removed "+chalk.bold(models.join(", "))+" models"));
    process.exit(0);
  });
}


var removeFolder = function(filePath) {
  if(fs.existsSync(filePath)){
    fs.readdirSync(filePath).forEach(function(file,index){
      var curPath = path.join(filePath, file);
      if(fs.lstatSync(curPath).isDirectory()) {
        console.log(chalk.blue("\tRemoving folder: "+chalk.bold(curPath.replace(process.cwd(), ""))));
        removeFolder(curPath);
      } else {
        console.log(chalk.blue("\tRemoving file: "+chalk.bold(curPath.replace(process.cwd(), ""))));
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(filePath);
  }
  return 0;
};


module.exports = removeModels;
