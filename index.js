#!/usr/bin/env node
'use strict';

if (require.main === module) {
  const chalk = require('chalk');
  const argv = require('minimist')(process.argv);
  const path = require('path');
  const fs = require('fs');
  const ip = argv._.splice(2);

  console.log("");
  process.on('exit', ()=>{
    console.log("");
  });

  let config;
  if (ip.indexOf("init") === -1) {
    if (!fs.existsSync(path.join(process.cwd(), "package.json"))) {
      console.log(" | " + chalk.red.bold("This is not the project root. Run this command  from the project root") + " |");
      process.exit(0);
    }
    config = require(path.join(process.cwd(), "package"));
  }

  global.color = argv.c || argv.color;
  global.npmconfig = config;
  process.on('unhandledRejection', (reason, p) => {
    console.log(chalk.red("Unhandled Rejection at: Promise "), p, chalk.red(" reason: "), chalk.red(reason));
  });

  process.on('unhandledException', (error, m)=> {
    console.log(chalk.red("Unhandled Exception at: Error "), m, chalk.red(" reason: "), chalk.red(error));
  })

  let jgen = require('./lib');

  if (ip[0] === "init") {
    jgen.setup(ip[1]);
  } else if (ip[0] === "fix" || ip[0] === "update") {
    jgen.fix();
  } else if (ip[0] === "model") {
    if (!ip[1]) {
      jgen.showModels();
    }
    if (ip[1].toLowerCase() === "remove") {
      let arr = ip.splice(2, process.argv.length);
      jgen.removeModels(arr);
    } else {
      jgen.model(ip[1]);
    }
  } else if (ip[0] === "tree") {
    let arr = ip.splice(1, process.argv.length);
    if (arr.length > 0) {
      jgen.tree(arr);
    } else {
      jgen.tree();
    }
  }
} else {
  exports.APIAuthentication = require('./lib/scripts/api-authentication');
  exports.Schema = require('./lib/schema');
}

