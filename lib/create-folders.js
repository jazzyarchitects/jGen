var fs = require('fs');
var async = require('async');
var chalk = require('chalk');

var folders = ['./config', './framework', './modules'];

var createFolders = function(cb){
  async.forEachLimit(folders, 5, function(folderName, callback){
    if(!fs.existsSync(folderName)){
      console.log(chalk.blue("Creating folder: ")+chalk.blue.bold(folderName.replace('./', '')));
      fs.mkdirSync(folderName);
    }
    callback();
  }, function(){
    cb();
  })
}

module.exports = createFolders;
