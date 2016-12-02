"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
const jgenConfig = require(path.join(__dirname, '..', 'jgenconfig.json'));

module.exports = function(app){

  var apiRouter = express.Router();
  let router = express.Router();

  var moduleDirectory = path.join(__dirname, '..', "./modules");
  fs.readdirSync(moduleDirectory).forEach(function(model){
    var routesPath = path.join(moduleDirectory, model, 'routes.js');
    var stats = fs.statSync(path.join(moduleDirectory, model));
    if(!stats.isDirectory()){
      return;
    }
    if(fs.existsSync(routesPath)){
      if(jgenConfig.apiModels.indexOf(model)!==-1){
        require(routesPath)(apiRouter);
      }else{
        require(routesPath)(router);
      }
    }
    var routesFolder = path.join(moduleDirectory, model, "routes");
    if(fs.existsSync(routesFolder)){
      fs.readdirSync(routesFolder).forEach(function(file){
        var st = fs.statSync(path.join(routesFolder, file));
        if(st.isFile()){
          if(jgenConfig.apiModels.indexOf(model)!==-1){
            require(path.join(routesFolder, file))(apiRouter);
          }else{
            require(path.join(routesFolder, file))(router);
          }
        }
      });
    }
  });

  app.use('/', router);
  app.use('/api', apiRouter);


}
