"use strict";

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let {{{ model.objectName }}} = mongoose.model('{{{ model.objectName }}}');
const LIMIT = 25;

let login = function(email, password){
  return {{{ model.objectName }}}.login({email: email, password: password}, app);
};

let signup = function(body){
  return {{{ model.objectName }}}.signup(body, app);
};

exports.login = login;
exports.signup = exports.register = signup;
