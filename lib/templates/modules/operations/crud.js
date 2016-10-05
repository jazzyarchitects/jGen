"use strict";

var mongoose = require('mongoose');
var {{% model.objectName %}} = mongoose.model('{{% model.objectName %}}');
const LIMIT = 25;

var get = function(id, page){
  return new Promise(function(resolve, reject){
    if(id){
      if(!mongoose.Types.ObjectId.isValid(id)){
        try {
          id = mongoose.Types.ObjectId(user_id);
        }catch (e){
          return reject(errorJSON(500, e));
        }
      }
      {{% model.objectName %}}.findOne({_id: id}, function(err, result){
        if(err){
          return reject(errorJSON(500, err));
        }
        resolve(result);
      })
    }else{
      page = page || 1;
      {{% model.objectName %}}.find({})
      .limit(LIMIT)
      .skip((page-1)*LIMIT)
      .exec(function(err, result){
        if(err){
          return reject(errorJSON(500, err));
        }
        resolve(result);
      });
    };
  });
};

var update = function(id, params){
  return new Promise(function(resolve, reject){
    if(!mongoose.Types.ObjectId.isValid(id)){
      try {
        id = mongoose.Types.ObjectId(user_id);
      }catch (e){
        return reject(errorJSON(500, e));
      }
    }
    {{% model.objectName %}}.update({_id: id}, {$set: params}, {upsert: true}, function(err, res){
      if(err){
        return reject(errorJSON(500, err));
      }
      resolve(result);
    });
  });
};

var create = function(params){
  return new Promise(function(resolve, reject){
    var {{% model.name %}} = new {{% model.objectName %}}(params);
    {{% model.name %}}.save(function(err, result){
      if(err){
        return reject(errorJSON(500, err));
      }
      resolve(result);
    });
  });
};

var remove = function(id){
  return new Promise(function(resolve, reject){
    if(id === undefined || id === null){
      return reject(errorJSON(500, "Either id or {{% model.name %}} object should be given for delete operation"));
    }
    if(typeof(id)==="object"){
      id = id._id;
    }else{
      if(!mongoose.Types.ObjectId.isValid(id)){
        try {
          id = mongoose.Types.ObjectId(user_id);
        }catch (e){
          return reject(errorJSON(500, e));
        }
      }
    }
    {{% model.objectName %}}.update({_id: id}, {$set: {active: false} }, {upsert: false}, function(err, result){
      if(err){
        return reject(errorJSON(500, err));
      }
      resolve(result);
    });
  });
}


exports.get = get;
exports.update = update;
exports.create = create;
exports.remove = remove;
