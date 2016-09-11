'use strict';
 var path = require('path');
 var rootPath = path.join(__dirname, "..");

 module.exports = {
     root: rootPath,
     db: {
          uri: '',
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
     }
 };
