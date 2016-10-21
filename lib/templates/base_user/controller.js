"use strict";

var Operations = require('./operations');

var get = function(req, res){
  Operations.Crud.get(req.params.id, req.query.page)
  .then((result)=>{
    res.json(successJSON(result));
  }, (err)=>{
    res.json(err);
  });
}


var update = function(req, res){
  Operations.Crud.update(req.params.id, req.body)
  .then((result)=>{
    res.json(successJSON(result));
  }, (err)=>{
    res.json(err);
  });
}

var create = function(req, res){
  Operations.Crud.create(req.body)
  .then((result)=>{
    res.json(successJSON(result));
  }, (err)=>{
    res.json(err);
  });
}

var remove = function(req, res){
  Operations.Crud.remove(req.params.id)
  .then((result)=>{
    res.json(successJSON(result));
  }, (err)=>{
    res.json(err);
  });
}

var login = function(req, res){
  Operations.Auth.login(req.body.email, req.body.password)
  .then((token)=>{
    res.cookie('auth_token', token, {maxAge: 10080*60, httpOnly: true});
    res.json(successJSON(token));
  },(err)=>{
    res.json(errorJSON(err));
  });
}

var signup = function(req, res){
  Operations.Auth.signup(req.body)
  .then((token)=>{
    res.cookie('auth_token', token, {maxAge: 10080*60, httpOnly: true});
    res.json(successJSON(token));
  },(err)=>{
    res.json(errorJSON(err));
  });
}

var logout = function(req, res){
  res.cookie('auth_token', token, {maxAge: 0, httpOnly: true});
  res.json(successJSON());
}

exports.get = get;
exports.update = update;
exports.create = create;
exports.remove = remove;
exports.login = login;
exports.signup = signup;
exports.logout = logout;
