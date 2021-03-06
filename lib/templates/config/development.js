'use strict';
 const path = require('path');
 const rootPath = path.join(__dirname, "..");

 module.exports = {
     root: rootPath,
     db: {
          uri: "mongodb://127.0.0.1/{{{ jgenconfig.database }}}",
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
        jwt: "{{{ jgenconfig.jwtsecret }}}"{{#if jgenConfig.apiAuthentication}},
        accessKeys: {{{ npmconfig.accessKeys }}}
        {{/if}}
     }
 };
