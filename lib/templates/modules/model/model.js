"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema({



});

mongoose.model({{% model.ObjectName %}}, modelSchema);
