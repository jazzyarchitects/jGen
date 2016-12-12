"use strict";

const fs = require('fs');
const async = require('async');
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');
const Log = require('jlogger');
const Handlebars = require('handlebars');

let files = {
  "./config": ['development.js', 'test.js', 'production.js', 'index.js', 'staging.js'],
  "./framework": ['express.js', 'bootstrap.js', 'utils.js', 'routes.js'],
  ".": ['server.js','.gitignore', '.foreverignore']
};
let templates = {};
_.extend(templates, files);
templates["./config"] = ['development.js', 'index.js'];

let writeFiles = function(){
  Log.hr();
  return new Promise(function(resolve){
    let jgenConfig = require(path.join(process.cwd(), 'jgenconfig.json'));

    async.forEachLimit(Object.keys(files), 2, function(folder, cb){
      async.forEachLimit(files[folder], 3, function(filename, _cb){
        let templateFile = templates[folder].indexOf(filename)===-1?templates[folder][0]:filename;
        let src = path.join(__dirname, "./templates", folder, templateFile);
        let dest = path.join(folder, filename);
        let content = fs.readFileSync(src).toString();


        for(let key of Object.keys(jgenConfig)){
          if(typeof(jgenConfig[key])==="object"){
            let reg = new RegExp("{{{ jgenconfig."+key+" }}}",'g');
            if(jgenConfig[key].development){
              if(filename.indexOf("development")!==-1){
                content = content.replace(reg, jgenConfig[key].development);
              }else if(filename.indexOf("test")!==-1){
                content = content.replace(reg, jgenConfig[key].test);
              }else if(filename.indexOf("staging")!==-1){
                content = content.replace(reg, jgenConfig[key].staging);
              }else if(filename.indexOf("production")!==-1){
                content = content.replace(reg, jgenConfig[key].production);
              }
            }
          }else{
            let reg = new RegExp("{{{ jgenconfig."+key+" }}}",'g');
            content = content.replace(reg, jgenConfig[key]);
          }
        }

        let template = Handlebars.compile(content);
        let data = {
          npmconfig: npmconfig,
          jgenConfig: jgenConfig
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
