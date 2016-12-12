"use strict";
const chalk = require('chalk');

let apiAuthentication = function(accessKeys){
  return function(req, res, next){
    if(accessKeys){
      if(typeof(accessKeys)!=="object" && typeof(accessKeys)!=="string"){
        console.log(chalk.red("cccessKeys parameter in config file should be an array of keys or a single string"));
        return next();
      }
      let key = req.query.access_key || req.query.accessKey || req.body.access_key || req.body.accessKey || req.headers.accessKey || req.headers.access_key || req.cookies.access_key || req.cookie.accessKey;
      if(key){
        let isValid = false;
        if(typeof(accessKeys)==="string"){
          isValid = accessKeys === key;
        }else{
          isValid = accessKeys.indexOf(key)!==-1;
        }
        req.clientAuthentication = isValid;
        callback(isValid);
        return next();
      }else{
        req.clientAuthentication = false;
        callback(false)
        return next();
      }
    }
    return next();
  }
}

module.exports = apiAuthentication;
