"use strict";

var fs = require('fs');
var async = require('async');
var chalk = require('chalk');
var path = require('path');
var _ = require('lodash');
var Log = require('jlogger');
var Handlebars = require('handlebars');

var files = {
  "./config": ['development.js', 'test.js', 'production.js', 'index.js', 'staging.js'],
  "./framework": ['express.js', 'bootstrap.js', 'utils.js', 'routes.js'],
  ".": ['server.js','.gitignore', '.foreverignore']
};
var templates = {};
_.extend(templates, files);
templates["./config"] = ['development.js', 'index.js'];

var writeFiles = function(){
  Log.hr();
  return new Promise(function(resolve){
    async.forEachLimit(Object.keys(files), 2, function(folder, cb){
      async.forEachLimit(files[folder], 3, function(filename, _cb){
        var templateFile = templates[folder].indexOf(filename)===-1?templates[folder][0]:filename;
        var src = path.join(__dirname, "./templates", folder, templateFile);
        var dest = path.join(folder, filename);
        var content = fs.readFileSync(src).toString();

        var template = Handlebars.compile(content);
        var data = {
          npmconfig: npmconfig
        };
        content = template(data);

        console.log(chalk.blue("Writing file: ")+chalk.blue.bold(path.join(folder, filename)));
        fs.writeFileSync(dest, content);
        _cb();
      }, function(){
        cb();
      })
    }, function(){
      resolve();
    })
  });
}

module.exports = writeFiles;
