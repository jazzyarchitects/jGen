"use strict";

var crypto = require('crypto');

module.exports = function(pass, salt, iterations, length){
  salt = salt || process.env.SALT || "jhf^*#+6232";
  return new Promise((resolve, reject)=>{
    salt = new Buffer(salt).toString('hex');
    crypto.pbkdf2(pass, salt, iterations, length, (err, hash)=>{
      if(err){
        return reject(err);
      }
      resolve(hash);
    });
  });
}
