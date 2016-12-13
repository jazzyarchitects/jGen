"use strict";

const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const log = global.color ? chalk[global.color] : chalk.blue;
const logBold = global.color ? chalk[global.color].bold : chalk.cyan.bold;

let tree = function (root, __root) {
  if (root === undefined) {
    root = process.cwd();
  }
  let level;
  __root = __root || process.cwd();
  if (__root.indexOf(process.cwd()) === -1) {
    __root = path.join(process.cwd(), __root);
  }
  if (root[root.length - 1] === "/") {
    root = root.substring(0, root.length - 1);
  }
  level = root.replace(__root, "").split("/").length;
  let tabStr = "  ";
  for (let i = 0; i < level; i++) {
    if (i === level - 1) {
      tabStr += log("-");
    } else {
      tabStr += log("  |");
    }
  }
  if (!fs.existsSync(root)) {
    return;
  }
  fs.readdirSync(root).forEach((dir)=>{
    if (dir !== "node_modules" && dir !== "bower_components" && dir[0] !== ".") {
      let fileStat = fs.statSync(path.join(root, dir));
      if (fileStat.isDirectory()) {
        console.log(tabStr + logBold(dir));
        tree(path.join(root, dir), __root);
      } else {
        let tabStr2 = tabStr.replace(/|/g, "");
        console.log(tabStr2 + log(dir));
      }
    }
  });
  return;
}

module.exports = tree;
