"use strict";

let crypto = require('crypto');

module.exports = function (pass, salt, iterations, length) {
  salt = salt || process.env.SALT || "jhf^*#+6232";
  return new Promise((resolve, reject)=>{
    salt = new Buffer(salt).toString('hex');
    crypto.pbkdf2(new Buffer(pass), salt, iterations, length, 'sha512', (err, hash)=>{
      if (err) {
        return reject(err);
      }
      resolve(hash);
    });
  });
}
