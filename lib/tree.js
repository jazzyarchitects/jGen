"use strict";

var fs = require('fs');
var chalk = require('chalk');
var path = require('path');


var log = color?chalk[color]:chalk.blue;
var logBold = color?chalk[color].bold:chalk.cyan.bold;

var tree = function(root){
  if(root===undefined){
    root = process.cwd();
  }
  var level;
  level = root.replace(process.cwd(), "").split("/").length;
  var tabStr = "";
  for(var i=0;i<level;i++){
    if(i===level-1){
      tabStr+=log("-");
    }else{
      tabStr+=log("  |");
    }
  }
  fs.readdirSync(root).forEach((dir)=>{
    if(dir!=="node_modules" && dir[0]!=="."){
      var fileStat = fs.statSync(path.join(root, dir));
      if(fileStat.isDirectory()){
        console.log(tabStr+logBold(dir));
        level = level+1;
        tree(path.join(root, dir));
      }else{
        var tabStr2 = tabStr.replace(/|/g,"");
        console.log(tabStr2+log(dir));
      }
    }
  });
  return;
}

module.exports = tree;
