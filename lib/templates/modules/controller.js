"use strict";

var Operations = require('./operations');

var get = function(req, res){
  Operations.Crud.get(req.params.id, req.query.page)
  .then(function(result){
    res.json(successJSON(result));
  }, function(err){
    res.json(err);
  });
}


var update = function(req, res){
  Operations.Crud.update(req.params.id, req.body)
  .then(function(result){
    res.json(successJSON(result));
  }, function(err){
    res.json(err);
  });
}

var create = function(req, res){
  Operations.Crud.create(req.body)
  .then(function(result){
    res.json(successJSON(result));
  }, function(err){
    res.json(err);
  });
}

var remove = function(req, res){
  Operations.Crud.remove(req.params.id)
  .then(function(result){
    res.json(successJSON(result));
  }, function(err){
    res.json(err);
  });
}

exports.get = get;
exports.update = update;
exports.create = create;
exports.remove = remove;