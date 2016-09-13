"use strict";

var fs = require('fs');
var async = require('async');
var path = require('path');
var chalk = require('chalk');
var Log = require('jlogger');

var files = {
  "./config": ['development.js', 'test.js', 'production.js', 'index.js', 'staging.js'],
  "./framework": ['express.js', 'bootstrap.js', 'utils.js'],
  ".": ['server.js', 'package.json']
}

var createFiles = function(){
  Log.hr();
  return new Promise(function(resolve){
    async.forEachLimit(Object.keys(files), 2, function(folder, cb){
      async.forEachLimit(files[folder], 3, function(filename, _cb){
        var filePath = path.join(folder, filename);
        if(!fs.existsSync(filePath)){
          console.log(chalk.blue("Creating file: ")+chalk.blue.bold(filePath));
          fs.writeFileSync(filePath, "");;
        }
        _cb();
      }, function(){
        cb();
      })
    }, function(){
      resolve();
    });
  });
}



module.exports = createFiles;
