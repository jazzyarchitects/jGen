#!/usr/bin/env node



if(require.main === module){
  //Cli
  /**
    process.argv[0] = "/usr/bin/nodejs"
    process.argv[1] = "/usr/bin/jgen";

  */

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // application specific logging, throwing an error, or other logic here
});

  var jgen = require('./lib/setup');
  if(process.argv[2]==="setup"){
    jgen.setup();
  }else if(process.argv[2]==="model"){
    if(!process.argv[3]){
      throw new Error("Model name cannot be empty");
    }
    jgen.model(process.argv[3]);
  }

}else{
  throw new Exception("This is a command line tool. Do not require this library in your scripts");
}

