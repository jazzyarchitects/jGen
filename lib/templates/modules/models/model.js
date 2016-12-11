"use strict";

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let modelSchema = new Schema({{{ model.properties }}});

mongoose.model("{{{ model.objectName }}}", modelSchema);
