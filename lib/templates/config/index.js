"use strict";

var _ = require('lodash');
var env = process.env.NODE_ENV || "development";

var config;

if(env === "production"){
  config = require('./development');
}else if(env === "staging"){
  config = require('./staging');
}else if(env === "test"){
  config = require("./test");
}else{
  config = require("./development");
}

module.exports = _.extend(config);
