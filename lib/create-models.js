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

var writeFiles = function(modelConfig, baseModel){

  if(baseModel==="none"){
    baseModel = undefined;
  }

  if(!fs.existsSync(path.join(process.cwd(), "modules"))){
    fs.mkdirSync(path.join(process.cwd(), "modules"));
  }

  modelConfig.name = modelConfig.modelName

  _.extend(dest, files);
  dest["./models"] = [];
  dest["./models"].push(modelConfig.modelName+".js");

  if(baseModel){
    modelConfig.baseModelName = baseModel;
    modelConfig.baseModelObjectName = baseModel[0].toUpperCase()+baseModel.substring(1,  baseModel.length);
    modelConfig.baseModelFileName = baseModel+".js";
    modelConfig.properties = {};

    for(var item of modelConfig.modelProperties){
      modelConfig["properties"][item.name] = {};
      for(var key of Object.keys(item)){
        if(key!=="name"){
          modelConfig["properties"][item.name][key] = item[key];
        }
      }
    }
    modelConfig.properties = JSON.stringify(modelConfig.properties, null, 2);
    files["./models"] = ["model-with-base.js"];
  }


  modelConfig.objectName =  modelConfig.modelName[0].toUpperCase()+modelConfig.modelName.substring(1, modelConfig.modelName.length);
  if(!fs.existsSync(path.join("./modules", modelConfig.modelName))){
    console.log(chalk.yellow("Creating model: ")+chalk.yellow.bold(modelConfig.modelName));
    fs.mkdirSync(path.join("./modules", modelConfig.modelName));
  };

  return new Promise(function(resolve, reject){
    async.forEachLimit(Object.keys(files), 3, function(key, cb){
      async.forEachLimit(files[key], 2, function(filename, _cb){

        var srcFolder = path.join("./modules", modelConfig.modelName, key);
        if(!fs.existsSync(srcFolder)){
          console.log(chalk.blue("Creating folder: ")+chalk.blue.bold(srcFolder));
          fs.mkdirSync(srcFolder);
        }
        var src;
        src = path.join(__dirname, "./templates", "./modules", key, filename);
        var content = fs.readFileSync(src).toString();


        var str = content;

        // for(var item of )
        // = content.replace(/{{% model.name %}}/g,model.name).replace(/{{% model.objectName %}}/g, model.objectName);

        for(var _key of Object.keys(modelConfig)){
          var reg = new RegExp("{{% model."+_key+" %}}","g");
          str = str.replace(reg, modelConfig[_key])
        }

        console.log(chalk.blue("Creating file: ")+chalk.blue.bold(path.join(key, modelConfig.modelName, filename)));
        var targetFile = dest[key].indexOf(filename)===-1?dest[key][0]:filename;
        fs.writeFileSync(path.join("./modules", modelConfig.modelName, key, targetFile), str);
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
