"use strict";

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var dependencies = {
  "async": "^1.5.2",
  "body-parser": "^1.14.2",
  "compression": "^1.0.1",
  "cookie-parser": "^1.1.0",
  "errorhandler": "^1.0.0",
  "express": "^4.2.0",
  "express-session": "^1.1.0",
  "jlogger": "^1.3.0",
  "lodash": "^3.0.0",
  "mongoose": "^4.0",
  "morgan": "^1.0.0",
  "request": "^2.67.0",
  "forever": "*"
};


var createPackage = function(config){

  return new Promise(function(resolve){
    var packagePath = path.join(".", "package.json");
    // if(!fs.existsSync(package)){
    //   fs.writeFileSync(packagePath, '');
    // }

    if(config.entry.indexOf(".js")===-1){
      config.entry = config.entry+".js";
    }


    global.npmconfig = config;

    var content = {};
    content.name = config.name.toLowerCase();
    content.version = config.version;
    content.description = config.description;
    content.main = config.entry;
    content.scripts = {};

    content.scripts.test = config.test;
    content.scripts.start = "forever "+config.entry;

    content.keywords = config.keywords.split(",").map(function(str){
      return str.trim();
    });
    if(content.keywords.indexOf(content.name)===-1){
      content.keywords.push(content.name);
    }
    content.author = config.author;
    content.license = config.license;

    content.dependencies = dependencies;

    content.repository = {
      url: config.git
    };

    console.log(chalk.blue("Creating ")+chalk.blue.bold("package.json"));

    fs.writeFileSync(packagePath, JSON.stringify(content, null, 2));
    process.nextTick(function(){
      resolve(config.entry);
    });
  });
}

module.exports = createPackage;