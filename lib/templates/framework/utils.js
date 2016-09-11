'use strict';

var fs = require('fs');
var path = require('path');

var walk = function (moduleDirectory, walkDirectory, callback) {
    if (!callback) {
        callback = requireFromModule;
    }
    // console.log(moduleDirectory);
    fs.readdirSync(moduleDirectory).forEach(function (dir) {
        var dirPath = path.join(moduleDirectory, dir);
        var dirStat = fs.statSync(dirPath);
        if (dirStat.isDirectory()) {
            // console.log(dirStat);
            var walkPath = path.join(dirPath, walkDirectory);
            fs.readdirSync(walkPath).forEach(function (file) {
                var filePath = path.join(walkPath, file);
                var fileStat = fs.statSync(filePath);
                if (fileStat.isFile() && /(.*)\.(js)$/.test(file)) {
                    var modulePath = path.join(dir, walkDirectory, file);
                    callback(modulePath);
                }
            });
        }
    });
};

var requireFromModule = function (filePath, callback) {
    module.paths.push('./modules');
    if (!callback)
        callback = require;
    return callback(filePath);
};

var successJSON = function (data) {
    return {success: true, data: data};
};

var errorJSON = function (errorCode, description, message) {
    return {
        success: false,
        error: true,
        errorCode: errorCode || 501,
        description: description || "INTERNAL_USE_ONLY",
        message: message
    };
};

var printRoutes = function (router, outputFileName, isNotApi) {
    if(process.env.NODE_ENV==="development" || !process.env.NODE_ENV){
        fs.writeFileSync('./tmp/routes/' + (isNotApi ? '' : 'api-') + (outputFileName || 'routes.json'), JSON.stringify(router.stack), 'utf-8')
    };
};

exports.walk = walk;
exports.requireFromModule = requireFromModule;
exports.successJSON = successJSON;
exports.errorJSON = errorJSON;
exports.printRoutes = printRoutes;