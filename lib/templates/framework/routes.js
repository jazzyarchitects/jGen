"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');

module.exports = function(app){

  var router = express.Router();

  var moduleDirectory = path.join(__dirname, '..', "./modules");
  fs.readdirSync(moduleDirectory).forEach(function(model){
    var routesPath = path.join(moduleDirectory, model, 'routes.js');
    var stats = fs.statSync(path.join(moduleDirectory, model));
    if(!stats.isDirectory()){
      return;
    }
    if(fs.existsSync(routesPath)){
      require(routesPath)(router);
    }
    var routesFolder = path.join(moduleDirectory, model, "routes");
    if(fs.existsSync(routesFolder)){
      fs.readdirSync(routesFolder).forEach(function(file){
        var st = fs.statSync(path.join(routesFolder, file));
        if(st.isFile()){
          require(path.join(routesFolder, file))(router);
        }
      });
    }
  });

  app.use('/api', router);


}
