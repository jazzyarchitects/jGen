'use strict';

var mongoose = require('mongoose');
var express = require('express');
var utils = require('./utils');
var fs = require('fs');
var path = require('path');
var Log = require('jlogger');

var moduleDir = './modules';

global.requireFromModule = utils.requireFromModule;
global.successJSON = utils.successJSON;
global.errorJSON = utils.errorJSON;
global.printRoutes = utils.printRoutes;

var connection;
console.log("Hello!!!");

module.exports = function (config) {

    global.app = express();
    global.Log = Log;
    require('./express')(app);

    Log.setGlobalConfig({
        "tagBold": true
    });

    Log.hr();
    //Connect to the database with given db url and options
    function connectDb() {
        mongoose.connect(config.db.uri, config.db.options, function(){
            Log.i("Mongoose Connection", "MongoDB connected");
        });
    }

    connectDb();

    function bootstrapModels() {
      var dir = 'models';
      utils.walk(moduleDir, dir);
    }

    bootstrapModels();

    function bootstrapRoutes() {
        Log.i("Bootstrap.js", "Bootstrapping routes");
        var router = express.Router();

        /*
            Insert routes here
        */
        app.use('/api', router);

        if(process.env.NODE_ENV === 'development' || !process.env.NODE_ENV){
            processRoutes();
        }
    }

    bootstrapRoutes();

    function processRoutes(dir) {
        var dirName = dir || './tmp/routes/';
        var string = "";
        fs.readdir(dirName, function (err, fileNames) {
            if (err) {
                fs.mkdirSync(dirName);
                return processRoutes(dir);
                Log.e("ProcessRoutes", "Error in storing routes");
            } else {
                Log.w("ProcessRoutes", "FileNames: " + JSON.stringify(fileNames));
                fileNames.forEach(function (fileName) {
                    fs.readFile(dirName + fileName, 'utf-8', function (err, content) {
                        if (fileName == fileNames[fileNames.length - 1]) {
                            string += '{"' + fileName + '":' + content + '}';
                            fs.writeFileSync('./tmp/routesRaw.json', '{"routes":[' + string + ']}', 'utf-8');
                            extractRoutes();
                        } else {
                            string += '{"' + fileName + '":' + content + '},';
                        }
                    });
                });
            }
        });
    }

    function extractRoutes() {
        fs.readFile('./tmp/routesRaw.json', function (err, string) {
            var file = JSON.parse(string);
            var content = file.routes;

            var html = "<!DOCTYPE html><html lang=\"en\"><head>" +
                "<meta charset=\"UTF-8\">" +
                "<title>Routes</title>" +
                "</head>" +
                "<body><div style=\"border: 1px #000 solid; width: 60%; margin: auto; padding: 5px;\">" +
                "<table width='100%'>" +
                "<tr>" +
                "<th>Prefix</th>" +
                "<th>Path</th>" +
                "<th>Methods</th>" +
                "</tr>";

            content.forEach(function (jsonObject) {
                var key = Object.keys(jsonObject)[0];
                var innerArray = jsonObject[key];
                html += '<tr><td colspan="3">&nbsp;<hr /></td></tr><tr style="border: #000000 2px solid;"><td>/' + key.replace('Routes.json','').replace("-","/") + '</td></tr>';
                innerArray.forEach(function (jObj) {
                    if (jObj.route) {
                        var route = jObj.route;
                        var path = route.path;
                        var stack = route.stack;
                        html+='<tr><td></td><td>'+path+'</td>';
                        var methods = [];
                        stack.forEach(function (stackObject) {
                            if (stackObject.name == "<anonymous>") {
                                methods.push(stackObject.method);
                            }
                        });
                        html += '<td>'+methods+'</td></tr>';
                    }
                });
            });

            html += '</table></div></body></html>';
            fs.writeFileSync('./tmp/routes.html',html);

        });
    }

    return app;
};
