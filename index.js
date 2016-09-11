#!/usr/bin/env node

var createFolder = require('./lib/create-folders');

if(require.main === module){
  //Cli
  createFolder(function(){
    console.log("Finished");
    process.exit(1);
  });
}else{
  throw new Exception("This is a command line tool. Do not require this library in your scripts");
}
