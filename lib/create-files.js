"use strict";

const fs = require('fs');
const async = require('async');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const Log = require('jlogger');

let files = {
  "./config": ['development.js', 'test.js', 'production.js', 'index.js', 'staging.js'],
  "./framework": ['express.js', 'bootstrap.js', 'utils.js', 'routes.js'],
  ".": ['server.js', 'package.json', '.gitignore', '.foreverignore', "jgenconfig.json"]
}
let dest = {};

let createFiles = function (entry) {
  _.extend(dest, files);
  if (entry) {
    if (entry.indexOf(".js") === -1) {
      entry = entry + ".js";
    }
    dest["."][0] = entry;
  }
  Log.hr();
  return new Promise(function (resolve) {
    async.forEachLimit(Object.keys(files), 2, function (folder, cb) {
      async.forEachLimit(files[folder], 3, function (filename, _cb) {
        let filePath = path.join(folder, filename);
        if (!fs.existsSync(filePath)) {
          console.log(chalk.blue("Creating file: ") + chalk.blue.bold(filePath));
          fs.writeFileSync(filePath, ""); ;
        }
        _cb();
      }, function () {
        cb();
      })
    }, function () {
      resolve();
    });
  });
}

module.exports = createFiles;
