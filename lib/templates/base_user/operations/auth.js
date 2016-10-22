"use strict";

var mongoose = require('mongoose');
var {{{ model.objectName }}} = mongoose.model('{{{ model.objectName }}}');
var jwt = require('jsonwebtoken');
const LIMIT = 25;

var login = function(email, password){

  return {{{ model.objectName }}}.login({email: email, password: password}, app);
};

var signup = function(body){

  return {{{ model.objectName }}}.signup(body, app);
};

exports.login = login;
exports.signup = exports.register = signup;
