'use strict';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var compression = require('compression');
var chalk = require('chalk');


module.exports = function (app) {

    // Prettify HTML
    app.locals.pretty = true;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(compression({
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        app.use(morgan('dev'));
    }

    // set .html as the default extension
    app.set('view engine', 'html');

    // Enable jsonp
    app.enable('jsonp callback');

    // The cookieParser should be above session
    app.use(cookieParser());



    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser());


    app.use(express.static(path.join(__dirname, '..', 'public')));

    //Error handler
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        app.use(errorHandler());
        app.get('/routes', (req, res, next)=>{
            res.sendFile(path.join(__dirname, "..", "tmp", "routes.html"));
        });
    }


    var len = "App is now live!".length;
    var col = process.stdout.columns?process.stdout.columns:40;
    var starCount = (col-len)/2-1;
    var str = "";
    for(var i = 0;i<starCount;i++){
        str+="*";
    }
    console.log(chalk.bgBlue.white(str+"App is now live!"+str));
};
