"use strict";
var express = require('express');
var router = express.Router();
var controller = require('./controller');


router.get('/', function (req, res) {
    controller.get(req, res);
});

router.get('/:id', function (req, res) {
  controller.get(req, res);
});

router.put('/:id', function(req, res){
  controller.update(req, res);
});

router.post('/', function(req, res){
  controller.create(req, res);
});

router.delete('/:id', function(req, res){
  controller.remove(req, res);
});

printRoutes(router,'{{% model.name %}}Routes.json');
module.exports = function (app) {
    app.use('/{{% model.name %}}', router);
};

