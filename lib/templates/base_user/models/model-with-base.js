"use strict";

const mongoose = require('mongoose');
let {{{ model.baseModelObjectName }}}Schema = require('jgen/lib/schemas/{{{ model.baseModelName }}}')

let modelSchema = new {{{ model.baseModelObjectName }}}Schema({{{ model.properties }}});

mongoose.model("{{{ model.objectName }}}", modelSchema);
