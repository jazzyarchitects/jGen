"use strict";

var mongoose = require('mongoose');
var {{{ model.objectName }}} = mongoose.model('{{{ model.objectName }}}');
var jwt = require('jsonwebtoken');
const LIMIT = 25;

var login = function(email, password){
  return new Promise((resolve, reject)=>{
    {{{ model.objectName }}}.findOne({email: email}).select("+password email _id").exec((err, doc)=>{
      if(err){
        return reject(err);
      }
      {{{ model.objectName }}}.getHash(password)
      .then((hash)=>{
        if(doc.password===password){
          var token = jwt.sign(doc, app.get('jwtsecret'), {
            expiresInMinutes: 10080
          });
          resolve(token);
        }
      });
    });
  });
};

var signup = function(body){
  return new Promise((resolve, reject)=>{
    var {{{ model.name }}} = new {{{ model.objectName }}}(body);
    {{{ model.name }}}.save((err, doc)=>{
      if(err){
        return reject(err);
      }
      var token = jwt.sign(doc, app.get('jwtsecret'), {
        expiresInMinutes: 10080
      });
      resolve(token);
    });
  });
};

exports.login = login;
exports.signup = exports.register = signup;
