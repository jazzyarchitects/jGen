"use strict";

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const dependencies = {
  "async": "^1.5.2",
  "body-parser": "^1.14.2",
  "compression": "^1.0.1",
  "cookie-parser": "^1.1.0",
  "errorhandler": "^1.0.0",
  "express": "^4.2.0",
  "express-session": "^1.1.0",
  "jlogger": "^1.3.0",
  "lodash": "^3.0.0",
  "mongoose": "^4.0",
  "morgan": "^1.0.0",
  "request": "^2.67.0",
  "redis": "^2.6.3",
  "mongoose-schema-extend": "^0.2.2",
  "chokidar": "^1.6.1",
  "jsonwebtoken": "^7.1.9",
  "jgen": "git+https://github.com/jazzyarchitects/jGen.git"
};

const devDependencies = {
  "chai": "^3.5.0",
  "request": "^2.67.0"
};

let createRandomString = function (len) {
  let allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+=-~";
  len = len || 20;
  let str = "";
  for (let i = 0; i < len; i++) {
    str += allowed[Math.floor(Math.random() * allowed.length)];
  }
  return str;
}

let createPackage = function (config) {
  return new Promise(function (resolve) {
    let packagePath = path.join(".", "package.json");
    if (config.entry.indexOf(".js") === -1) {
      config.entry = config.entry + ".js";
    }

    if (config.apiAuthentication) {
      // config.accessKeys = [];
      let keys = [];
      for (let i = 0; i < 3; i++) {
        keys.push(createRandomString(20));
      }
      config.accessKeys = "[\"" + keys[0] + "\", \"" + keys[1] + "\",\"" + keys[2] + "\"]";
    }

    global.npmconfig = config;

    let content = {};
    content.name = config.name.toLowerCase();
    content.version = config.version;
    content.description = config.description;
    content.main = config.entry;
    content.scripts = {};

    content.scripts.test = config.test;
    content.scripts.start = "node " + config.entry;

    content.keywords = config.keywords.split(",").map(function (str) {
      return str.trim();
    });
    if (content.keywords.indexOf(content.name) === -1) {
      content.keywords.push(content.name);
    }
    content.author = config.author;
    content.license = config.license;

    content.dependencies = dependencies;
    content.devDependencies = devDependencies;

    content.repository = {
      url: config.git
    };

    let jgenconfig = {};
    jgenconfig.database = {};
    jgenconfig.database.development = config.database;
    jgenconfig.database.test = config.database;
    jgenconfig.database.staging = config.database;
    jgenconfig.database.production = config.database;

    jgenconfig.jwtsecret = {};
    jgenconfig.jwtsecret.development = createRandomString(20);
    jgenconfig.jwtsecret.test = createRandomString(20);
    jgenconfig.jwtsecret.staging = createRandomString(30);
    jgenconfig.jwtsecret.production = createRandomString(30);

    jgenconfig.apiAuthentication = config.apiAuthentication;

    console.log(chalk.blue("Creating ") + chalk.blue.bold("package.json"));

    fs.writeFileSync(path.join('.', 'jgenconfig.json'), JSON.stringify(jgenconfig, null, 2));

    fs.writeFileSync(packagePath, JSON.stringify(content, null, 2));
    process.nextTick(function () {
      resolve(config.entry);
    });
  });
}

module.exports = createPackage;
