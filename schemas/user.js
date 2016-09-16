"use strict";

var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

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

BaseUserSchema.pre('save', function(next, done){
  var userObject = this;
  this.password = getPasswordHash(userObject.password)
});

BaseUserSchema.statics.login = function(user, callback){
  var UserModel = this;
  return new Promise(function(resolve, reject){
    UserModel.findOne({email: user.email, password: getPasswordHash(user.password)}, function(err, doc){
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
