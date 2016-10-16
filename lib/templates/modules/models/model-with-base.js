"use strict";

var mongoose = require('mongoose');
var {{{ model.baseModelObjectName }}}Schema = require('jgen/lib/schemas/{{{ model.baseModelName }}}')

var modelSchema = new {{{ model.baseModelObjectName }}}Schema({{{ model.properties }}});

mongoose.model("{{{ model.objectName }}}", modelSchema);
