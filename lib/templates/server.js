
'use strict';

var config = require('./config');
var app = require('./framework/bootstrap')(config);
var chalk = require('chalk');

var server_port = config.port;

app.listen(server_port, function () {
  console.log(chalk.red.bold("Server running at port: "+port));
});

