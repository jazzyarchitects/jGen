"use strict";

var apiAuthentication = function(config, callback){
  if(!callback){
    callback = () => {};
  }
  return function(req, res, next){
    if(config.accessKeys){
      if(typeof(config.accessKeys)!=="array"){
        console.warn("accessKeys parameter in config file should be an array");
        return next();
      }
      var key = req.query.access_key || req.query.accessKey || req.body.access_key || req.body.accessKey || req.headers.accessKey || req.headers.access_key || req.cookies.access_key || req.cookie.accessKey;
      if(key){
        var isValid = config.accessKeys.indexOf(key)!==-1;
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
