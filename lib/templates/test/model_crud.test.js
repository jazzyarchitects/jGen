"use strict";

const chai = require('chai');
const request = require('request');
const mongoose = require('mongoose');
const expect = chai.expect;
const fs = require('fs');
const path = require('path');

before(()=>{
  let app;
  if(fs.existsSync(path.join(process.cwd(), "server.js"))){
    app = require(path.join(process.cwd(), "server.js"));
  }else{
    app = require(path.join(process.cwd(), "index.js"));
  }
  app.start();
});

describe("{{{ model.modelObjectName }}} CRUD Test", ()=>{
  it("{{{ model.modelObjectName }}} READ test", (done)=>{
    request.get("http://localhost:3000/api/{{{ model.name }}}", function(error, response, body){
      let res = JSON.parse(body);
      expect(error).to.be.null;
      expect(response.statusCode).to.equal(200);
      expect(res.error).to.be.undefined;

      expect(res.data).to.be.json;

      //Check if JSON Array
      expect(Object.keys(res.data).length).to.equal(0);
      async.forEachLimit(res.data, 5, (d, _cb)=>{
        expect(d).to.be.json;
        expect(d._id).to.satisfy((id)=>{
          return mongoose.Types.ObjectId.isValid(id);
        });
      });
    });
  });
});


// Incomplete. Cannot figure out a way to test custom model Create requests
