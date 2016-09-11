#!/usr/bin/env node



if(require.main === module){
  //Cli
  /**
    process.argv[0] = "/usr/bin/nodejs"
    process.argv[1] = "/usr/bin/jgen";

  */

  if(process.argv[2]==="setup"){
    var setup = require('./lib/setup');
    setup();
  }

}else{
  throw new Exception("This is a command line tool. Do not require this library in your scripts");
}
