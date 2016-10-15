#!/usr/bin/env node
"use strict";


if(require.main === module){
  var chalk = require('chalk');
  var argv = require('minimist')(process.argv);
  var ip = argv._.splice(2);

  global.color = argv.c || argv.color;
  // console.log(argv);
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

    if(ip[0]==="init"){
      jgen.setup();
    }else if(ip[0]==="fix" || ip[0]==="update"){
      jgen.fix();
    }else if(ip[0]==="model"){
      if(!ip[1]){
        jgen.showModels();
      }
      if(ip[1].toLowerCase()==="remove"){
        var arr = ip.splice(2, process.argv.length);
        jgen.removeModels(arr);
      }else{
        jgen.model(ip[1]);
      }
    }else if(ip[0]==="tree"){
      var arr = ip.splice(1, process.argv.length);
      if(arr.length>0){
        jgen.tree(arr);
      }else{
        jgen.tree();
      }
    }

  }else{
    exports.apiAuthentication = require('./lib/scripts/api-authentication');
    exports.BaseUserSchema = require('./lib/schemas/user');
  }

