"use strict";

var fs = require('fs');
var async = require('async');
var _ = require('lodash');
var path = require('path');
var chalk = require('chalk');

var files = {
  ".": ['routes.js', 'controller.js'],
  "./models": ['model.js'],
  "./operations": ['index.js', 'crud.js']
};

var dest = {};

var writeFiles = function(modelName){

  if(!fs.existsSync(path.join(process.cwd(), "modules"))){
    fs.mkdirSync(path.join(process.cwd(), "modules"));
  }

  var model = {
    name: modelName
  };
  model.objectName =  modelName[0].toUpperCase()+modelName.substring(1, modelName.length);
  if(!fs.existsSync(path.join("./modules", modelName))){
    console.log(chalk.yellow("Creating model: ")+chalk.yellow.bold(modelName));
    fs.mkdirSync(path.join("./modules", modelName));
  };
  return new Promise(function(resolve, reject){
    _.extend(dest, files);
    dest["./models"] = [];
    dest["./models"].push(modelName+".js");
    async.forEachLimit(Object.keys(files), 3, function(key, cb){
      async.forEachLimit(files[key], 2, function(filename, _cb){
        var srcFolder = path.join("./modules", modelName, key);
        if(!fs.existsSync(srcFolder)){
          console.log(chalk.blue("Creating folder: ")+chalk.blue.bold(srcFolder));
          fs.mkdirSync(srcFolder);
        }
        var src = path.join(__dirname, "./templates", "./modules", key, filename);
        var content = fs.readFileSync(src).toString();
        var str = content.replace(/{{% model.name %}}/g,model.name).replace(/{{% model.objectName %}}/g, model.objectName);
        console.log(chalk.blue("Creating file: ")+chalk.blue.bold(path.join(key, modelName, filename)));
        var targetFile = dest[key].indexOf(filename)===-1?dest[key][0]:filename;
        fs.writeFileSync(path.join("./modules", modelName, key, targetFile), str);
        _cb();
      }, function(){
        cb();
      });
    }, function(){
      resolve();
    })
  });
}

module.exports = writeFiles;
