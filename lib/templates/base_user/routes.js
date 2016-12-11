"use strict";
const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/login', function(req, res){
  controller.login(req, res);
});

router.post('/signup', function(req, res){
  controller.signup(req, res);
});

router.get('/logout', function(req, res){
  controller.logout(req, res);
});

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

printRoutes(router,'{{{ model.name }}}Routes.json', {{{ model.isPrivate }}});
module.exports = function (app) {
    app.use('/{{{ model.name }}}', router);
};

