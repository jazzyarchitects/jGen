"use strict";

var fs = require('fs');
var chalk = require('chalk');
var path = require('path');


var log = color?chalk[color]:chalk.blue;
var logBold = color?chalk[color].bold:chalk.cyan.bold;

var tree = function(root, __root){
  if(root===undefined){
    root = process.cwd();
  }
  var level;
  __root = __root || process.cwd();
  if(__root.indexOf(process.cwd())===-1){
    __root = path.join(process.cwd(), __root);
  }
  if(root[root.length-1]==="/"){
    root = root.substring(0, root.length-1);
  }
  level = root.replace(__root, "").split("/").length;
  var tabStr = "  ";
  for(var i=0;i<level;i++){
    if(i===level-1){
      tabStr+=log("-");
    }else{
      tabStr+=log("  |");
    }
  }
  if(!fs.existsSync(root)){
    return;
  }
  fs.readdirSync(root).forEach((dir)=>{
    if(dir!=="node_modules" && dir[0]!=="."){
      var fileStat = fs.statSync(path.join(root, dir));
      if(fileStat.isDirectory()){
        console.log(tabStr+logBold(dir));
        tree(path.join(root, dir), __root);
      }else{
        var tabStr2 = tabStr.replace(/|/g,"");
        console.log(tabStr2+log(dir));
      }
    }
  });
  return;
}

module.exports = tree;
