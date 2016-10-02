#!/usr/bin/env node
"use strict";

var chalk = require('chalk');

if(require.main === module){
  //Cli
  /**
    process.argv[0] = "/usr/bin/nodejs"
    process.argv[1] = "/usr/bin/jgen";

  */

process.on('unhandledRejection', (reason, p) => {
    console.log(chalk.red("Unhandled Rejection at: Promise "), p, chalk.red(" reason: "), chalk.red(reason));
});

process.on('unhandledException', (error, m)=> {
  console.log(chalk.red("Unhandled Exception at: Error "), m, chalk.red(" reason: "), chalk.red(error));
})

  var jgen = require('./lib');
  if(process.argv[2]==="init"){
    jgen.setup();
  }else if(process.argv[2]==="fix" || process.argv[2]==="update"){
    jgen.fix();
  }else if(process.argv[2]==="model"){
    if(!process.argv[3]){
      throw new Error("Model name cannot be empty");
    }
    jgen.model(process.argv[3]);
  }

}else{
  exports.apiAuthentication = require('./lib/scripts/api-authentication');
}

