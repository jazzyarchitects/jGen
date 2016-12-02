"use strict"

var async = require('async');
var fs = require('fs');
var _ = require("lodash");
var path = require("path")
var chalk = require("chalk")
var Handlebars = require('handlebars');

var files = {
  "./config": ['development.js', 'test.js', 'production.js', 'index.js', 'staging.js'],
  "./framework": ['express.js', 'bootstrap.js', 'utils.js', 'routes.js'],
  ".": ['server.js','.gitignore', '.foreverignore']
};

var templates = {};
_.extend(templates, files);
templates["./config"] = ['development.js', 'index.js'];

var fixFiles = function(npmconfig){
  let jgenConfig = require(path.join(process.cwd(), 'jgenconfig.json'));
  return new Promise(function(resolve){
    async.forEachLimit(Object.keys(files), 2, function(folder, cb){
      async.forEachLimit(files[folder], 3, function(filename, _cb){
        var dest = path.join(folder, filename);
        if(!fs.existsSync(dest)){
          var templateFile = templates[folder].indexOf(filename)===-1?templates[folder][0]:filename;
          var src = path.join(__dirname, "./templates", folder, templateFile);
          var content = fs.readFileSync(src).toString();

          // for(let key of Object.keys(npmconfig)){
          //   if(typeof(npmconfig[key])!=="object"){
          //     let reg = new RegExp("{{% npmconfig."+key+" %}}","g");
          //     content = content.replace(reg, npmconfig[key]);
          //   }
          // }
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
              console.log("Else");
              let reg = new RegExp("{{{ jgenconfig."+key+" }}}",'g');
              content = content.replace(reg, jgenConfig[key]);
            }
          }


          var template = Handlebars.compile(content);
          var data = {
            npmconfig: npmconfig
          };
          content = template(data);

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

