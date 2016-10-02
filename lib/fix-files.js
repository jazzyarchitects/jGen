"use strict"

var async = require('async');
var fs = require('fs');
var _ = require("lodash");
var path = require("path")
var chalk = require("chalk")

var files = {
  "./config": ['development.js', 'test.js', 'production.js', 'index.js', 'staging.js'],
  "./framework": ['express.js', 'bootstrap.js', 'utils.js', 'routes.js'],
  ".": ['server.js','.gitignore', '.foreverignore']
};

var templates = {};
_.extend(templates, files);
templates["./config"] = ['development.js', 'index.js'];

var fixFiles = function(npmconfig){
  return new Promise(function(resolve){
    async.forEachLimit(Object.keys(files), 2, function(folder, cb){
      async.forEachLimit(files[folder], 3, function(filename, _cb){
        var dest = path.join(folder, filename);
        if(!fs.existsSync(dest)){
          var templateFile = templates[folder].indexOf(filename)===-1?templates[folder][0]:filename;
          var src = path.join(__dirname, "./templates", folder, templateFile);
          var content = fs.readFileSync(src).toString();

          for(var key of Object.keys(npmconfig)){
            if(typeof(npmconfig[key])!=="object"){
              var reg = new RegExp("{{% npmconfig."+key+" %}}","g");
              content = content.replace(reg, npmconfig[key]);
            }else{
              if(key==="jgenConfig"){
                for(var _k of Object.keys(npmconfig[key])){

                  var reg = new RegExp("{{% npmconfig."+_k+" %}}","g");
                  content = content.replace(reg, npmconfig[key][_k]);
                }
              }
            }
          }
          console.log(chalk.blue("Fixing file: ")+chalk.blue.bold(dest));
          fs.writeFileSync(dest, content);;
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

module.exports = fixFiles;

