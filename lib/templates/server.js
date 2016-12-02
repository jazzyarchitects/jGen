'use strict';

const config = require('./config');
const chalk = require('chalk');
let app = undefined;

const server_port = config.server.port;

exports.start = (isTest)=>{
  if(isTest===undefined){
    config.db.uri = config.db.uri+"_test";
  }
  app = require('./framework/bootstrap')(config);
  app.listen(server_port, function () {
    console.log(chalk.red.bold("Server running at port: "+server_port));
  });
};

exports.close = ()=> {
  app.close();
};


process.on('unhandledRejection', (reason, p) => {
  console.log(chalk.red("Unhandled Rejection at: Promise "), p, chalk.red(" reason: "), chalk.red(reason));
});

process.on('unhandledException', (error, m)=> {
  console.log(chalk.red("Unhandled Exception at: Error "), m, chalk.red(" reason: "), chalk.red(error));
})

if(require.main === module){
  exports.start(false);
}
