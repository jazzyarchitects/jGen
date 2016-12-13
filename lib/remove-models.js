"use strict";

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const async = require('async');

let removeModels = function (models) {
  async.forEachLimit(models, 5, function (model, _cb) {
    let modelPath = path.join(process.cwd(), "modules", model);
    if (fs.existsSync(modelPath)) {
      console.log(chalk.yellow("Removing model: " + chalk.bold(model)));
      removeFolder(modelPath);
    } else {
      console.log(chalk.red(chalk.bold(model) + " model does not exists. Skipping..."));
    }
    _cb();
  }, function (results) {
    console.log(chalk.green("Removed " + chalk.bold(models.join(", ")) + " models"));
    process.exit(0);
  });
}

let removeFolder = function (filePath) {
  if (fs.existsSync(filePath)) {
    fs.readdirSync(filePath).forEach(function (file, index) {
      let curPath = path.join(filePath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        console.log(chalk.blue("\tRemoving folder: " + chalk.bold(curPath.replace(process.cwd(), ""))));
        removeFolder(curPath);
      } else {
        console.log(chalk.blue("\tRemoving file: " + chalk.bold(curPath.replace(process.cwd(), ""))));
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(filePath);
  }
  return 0;
};

module.exports = removeModels;
