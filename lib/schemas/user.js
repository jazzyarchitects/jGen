"use strict";

const mongoose = require('mongoose');
const getPasswordHash = require('../utils/password');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

function BaseUser (addFields) {
  let BaseUserSchema = new Schema({
    name: {
      type: String,
      validate: {
        validator: function (v) {
          let reg = new RegExp(/[a-zA-Z ]+/);
          return reg.test(v);
        },
        message: "Invalid name. Name can only contain alphabets from A to Z and space."
      }
    },
    email: {
      type: String,
      unique: [true, "Duplicate email id"],
      validate: {
        validator: function (e) {
          let arr = e.split('@');
          if (arr.length !== 2 || e.indexOf(" ") !== -1) {
            return false;
          }
          let sec = arr[1].split('.');
          for (let s of sec) {
            if (s.length <= 1) {
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

  BaseUserSchema.__hash = BaseUserSchema.statics.hash = {iterations: 6846, salt: "d3234kjnXS^&", length: 32};

  BaseUserSchema.methods.setHash = function (options) {
    for (let key of Object.keys(options)) {
      BaseUserSchema.__hash[key] = BaseUserSchema.statics.__hash[key] = options[key];
    }
  }

  BaseUserSchema.statics.getHash = function (password) {
    return new Promise((resolve, reject)=>{
      getPasswordHash(password, BaseUserSchema.__hash.salt, BaseUserSchema.__hash.iterations, BaseUserSchema.__hash.length)
      .then((hash)=>{
        resolve(hash);
      });
    });
  }

  BaseUserSchema.pre('save', function (next, done) {
    let userObject = this;
    getPasswordHash(userObject.password, BaseUserSchema.__hash.salt, BaseUserSchema.__hash.iterations, BaseUserSchema.__hash.length)
    .then((hash)=>{
      userObject.password = hash;
      next();
    }, (err)=>{
      done(err);
    });
  });

  BaseUserSchema.statics.login = function (user, app, callback) {
    let UserModel = this;
    return new Promise(function (resolve, reject) {
      getPasswordHash(user.password, BaseUserSchema.__hash.salt, BaseUserSchema.__hash.iterations, BaseUserSchema.__hash.length)
      .then((hash)=>{
        UserModel.findOne({email: user.email, password: hash}, function (err, doc) {
          if (err) {
            if (callback) {
              return callback(err, null);
            }
            return reject(err);
          } else {
            let token = jwt.sign(doc._id, app.get('jwtsecret'), {
              expiresIn: 10080
            });
            if (callback) {
              return callback(null, token);
            }
            return resolve(token);
          }
        });
      }, (err)=>{
        if (callback) {
          return callback(err, null);
        }
        return reject(err);
      });
    });
  }

  BaseUserSchema.statics.signup = function (user, app, callback) {
    let UserModel = this;
    return new Promise(function (resolve, reject) {
      try {
        user = new UserModel(user);
        user.save(function (err, doc) {
          if (err) {
            if (callback) {
              return callback(err, null);
            }
            return reject(err);
          } else {
            let token = jwt.sign(doc._id, app.get('jwtsecret'), {
              expiresIn: 10080
            });
            if (callback) {
              return callback(null, token);
            }
            return resolve(token);
          }
        });
      } catch (err) {
        if (callback) {
          return callback(err);
        }
        reject(err)
      }
    });
  }

  if (addFields) {
    BaseUserSchema.add(addFields);
  }

  return BaseUserSchema;
}

module.exports = BaseUser;
