"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BaseUserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: function(v){
        var reg = new RegExp(/[a-zA-Z ]+/);
        return reg.test(v);
      },
      message:  "Invalid name. Name can only contain alphabets from A to Z."
    },
  },
  email: {
    type: String,
    validate: {
      validator: function(e){
        var arr = e.split('@');
        if(arr.length !== 2 || e.indexOf(" ")!==-1){
          return false;
        }
        var sec = arr[1].split('.');
        for(var s of sec){
          if(s.length<=1){
            return false;
          }
        }
        return /[a-zA-Z0-9!#$%&'*+-/=?^._`{|}~]+/.test(arr[0])
      },
      messgae: "Invalid email id."
    },
    required: [true, "Email id is required"]
  },
  password: {
    type: String,
    select: false
  }
});



module.exports = BaseUserSchema
