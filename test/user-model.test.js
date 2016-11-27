'use strict';

process.env.NODE_ENV="test";
const chai = require('chai');
const path = require('path');
const request = require('request');
const app = require('../mocha-test/server');
const expect = chai.expect;
const mongoose = require('mongoose');
const chaiFiles = require('chai-files');
const file = chaiFiles.file;
const dir = chaiFiles.dir;

const HTTP_BASE = "http://localhost:3000"
const API_BASE = HTTP_BASE+"api";
chai.use(chaiFiles);

let __folder = "mocha-test";
if(!fs.existsSync(path.join(process.cwd(), __folder))){
  __folder = "test-server";
}
__folder = path.join(process.cwd(), __folder, "modules", "user");


before(()=>{
  app.start();
});

describe("User model file structure", ()=>{
  describe("Model directory", ()=>{
    it("Has folder models", ()=>{
      expect(dir(path.join(__folder, "models"))).to.exist;
    });
    it("Contains file: user.js", ()=>{
      expect(file(path.join(__folder, "models", "user.js"))).to.exist;
    });
  });


  describe("Operations directory", ()=>{
    it("Has folder operations", ()=>{
      expect(dir(path.join(__folder, "operations"))).to.exist;
    });
    let fileList = ["index.js", "crud.js", "auth.js"];
    fileList.forEach((f)=>{
      it("Contains file: "+f, ()=>{
        expect(file(path.join(__folder, "operations", f))).to.exist;
      });
    });
  });
});

describe("User API endpoints", ()=>{

  describe("CRUD", ()=>{
    it("Create User", (done)=>{
      request.post(HTTP_BASE+'/api/user', {name: 'Jibin Mathews', email: 'jibinmathews7@gmail.com', password: 'jibinmathews7'}, (err, res, body)=>{
        expect(err).to.be.null;
        expect(res.statusCode).to.equal(200);
        expect(res).to.not.be.null;

        body = JSON.parse(body);
        expect(body).to.have.property('success');
        if(!body.success){
          expect(body).to.have.property('errorCode');
          expect(body.errorCode).to.satisfy((num)=>{
            return num===403 || (num>=500 && num<=510);
          });
        }else{
          expect(body.err).to.be.undefined;
          expect(body.data).to.exist;
          expect(body.data).to.be.json;
          expect(body.data).to.have.property("_id");
          expect(body.data).to.have.property("email");
          expect(body.data).to.have.property("name");
          expect(body.data.password).to.be.undefined;
          expect(body.data._id).to.satisfy((id)=>{
            return mongoose.Types.ObjectId.isValid(id);
          });
        }
        done();
      });
    });
    it("Query All Users", (done)=>{
      request.get(HTTP_BASE+"/api/user", (err, res, body)=>{
        expect(err).to.be.null;
        expect(res.statusCode).to.equal(200);
        body = JSON.parse(body);
        expect(body).to.have.property("success");
        expect(body.success).to.be.true;
        expect(body.data).to.be.json;
        done();
      });
    });
  });
});
