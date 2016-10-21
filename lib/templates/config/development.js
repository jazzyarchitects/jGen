'use strict';
 var path = require('path');
 var rootPath = path.join(__dirname, "..");

 module.exports = {
     root: rootPath,
     db: {
          uri: "mongodb://127.0.0.1/{{{ npmconfig.database }}}",
          options: {
             server: {
                socketOptions: {
                     keepAlive: 1
                 }
             }
         }
     },
     server: {
         port: Number(process.env.PORT || 3000)
     },
     secret:{
        jwt: "{{{ npmconfig.jwtsecret }}}"
     }
 };
