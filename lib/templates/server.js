'use strict';

const config = require('./config');
const app = require('./framework/bootstrap')(config);
const chalk = require('chalk');

const server_port = config.server.port;

app.listen(server_port, function () {
  console.log(chalk.red.bold("Server running at port: "+server_port));
});

process.on('unhandledRejection', (reason, p) => {
  console.log(chalk.red("Unhandled Rejection at: Promise "), p, chalk.red(" reason: "), chalk.red(reason));
});

process.on('unhandledException', (error, m)=> {
  console.log(chalk.red("Unhandled Exception at: Error "), m, chalk.red(" reason: "), chalk.red(error));
})
