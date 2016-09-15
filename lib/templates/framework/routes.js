"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');

module.exports = function(app){

  var router = express.Router();

  var moduleDirectory = path.join(__dirname, '..', "./modules");
  fs.readdirSync(moduleDirectory).forEach(function(model){
    var routesPath = path.join(moduleDirectory, model, 'routes.js');
    if(fs.existsSync(routesPath)){
      require(routesPath)(router);
    }
  });

  app.use('/api', router);


}
