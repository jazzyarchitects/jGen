"use strict";

var mongoose = require('mongoose');
var getPasswordHash = require('../utils/password');
var Schema = mongoose.Schema;


BaseUserSchema.__hash = BaseUserSchema.statics.hash = {iterations: 6846, salt: "d3234kjnXS^&", length: 32};

var BaseUserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: function(v){
        var reg = new RegExp(/[a-zA-Z ]+/);
        return reg.test(v);
      },
      message:  "Invalid name. Name can only contain alphabets from A to Z and space."
    },
  },
  email: {
    type: String,
    unique: [true, "Duplicate email id"],
    validate: {
      validator: function(e){
        var arr = e.split('@');
        if(arr.length !== 2 || e.indexOf(" ")!==-1){
          return false;
        }
        var sec = arr[1].split('.');
        for(var s of sec){
          if(s.length<=1){
            return false;
          }
        }
        return /[a-zA-Z0-9!#$%&'*+-/=?^._`{|}~]+/.test(arr[0])
      },
      messgae: "Invalid email id."
    },
    required: [true, "Email id is required"]
  },
  password: {
    type: String,
    select: false
  }
});

BaseUserSchema.prototype.setHash = function(options){
  for(var key of Object.keys(options)){
    BaseUserSchema.__hash[key] = BaseUserSchema.statics.__hash[key] = options[key];
  }
}

BaseUserSchema.pre('save', function(next, done){
  var userObject = this;
  getPasswordHash(userObject.password, BaseUserSchema.__hash.salt, BaseUserSchema.__hash.iterations, BaseUserSchema.__hash.length)
  .then((hash)=>{
    userObject.password = hash;
    next();
  }, (err)=>{
    done(err);
  });
});


BaseUserSchema.statics.login = function(user, callback){
  var UserModel = this;
  return new Promise(function(resolve, reject){
    getPasswordHash(user.password, BaseUserSchema.__hash.salt, BaseUserSchema.__hash.iterations, BaseUserSchema.__hash.length)
    .then((hash)=>{
      UserModel.findOne({email: user.email, password: hash}, function(err, doc){
        if(err){
          if(callback){
            return callback(err, null);
          }
          return reject(err);
        }else{
          if(callback){
            return callback(null, doc);
          }
          return resolve(doc);
        }
      });
    },(err)=>{
      if(callback){
        return callback(err, null);
      }
      return reject(err);
    });
  });
}

BaseUserSchema.statics.signup = function(user, callback){
  var UserModel = this;
  return new Promise(function(resolve, reject){
    try{
      user = new UserModel(user);
      user.save(function(err, doc){
        if(err){
          if(callback){
            return callback(err, null);
          }
          return reject(err);
        }else{
          if(callback){
            return callback(null, doc);
          }
          return resolve(doc);
        }
      });
    }catch(err){
      if(callback){
        return callback(err);
      }
      reject(err)
    }
  });
}

module.exports = BaseUserSchema
