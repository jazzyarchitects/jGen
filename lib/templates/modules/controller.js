"use strict";

let Operations = require('./operations');

let get = function (req, res) {
  Operations.Crud.get(req.params.id, req.query.page)
  .then((result)=>{
    res.json(successJSON(result));
  }, (err)=>{
    res.json(err);
  });
}

let update = function (req, res) {
  Operations.Crud.update(req.params.id, req.body)
  .then((result)=>{
    res.json(successJSON(result));
  }, (err)=>{
    res.json(err);
  });
}

let create = function (req, res) {
  Operations.Crud.create(req.body)
  .then((result)=>{
    res.json(successJSON(result));
  }, (err)=>{
    res.json(err);
  });
}

let remove = function (req, res) {
  Operations.Crud.remove(req.params.id)
  .then((result)=>{
    res.json(successJSON(result));
  }, (err)=>{
    res.json(err);
  });
}

exports.get = get;
exports.update = update;
exports.create = create;
exports.remove = remove;
