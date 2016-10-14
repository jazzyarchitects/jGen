"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema({{% model.properties %}});

mongoose.model("{{% model.objectName %}}", modelSchema);
