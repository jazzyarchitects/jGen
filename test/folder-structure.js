"use strict";
var chai = require('chai');
const chaiFiles = require('chai-files');
const expect = chai.expect;
const file = chaiFiles.file;
const dir = chaiFiles.dir;
const path = require('path');
const chalk = require('chalk');

chai.use(chaiFiles);
let __folder = "mocha-test";

let foldersList = ["config", "framework", "modules", "node_modules"];
describe("Project Structure setup", function () {

  describe("Check folder Structure", ()=>{
    foldersList.forEach((name)=>{
      it("Has folder: "+chalk.bold(name), ()=>{
        expect(dir(path.join(__folder, name))).to.exist;
      });
    });
  });

  describe("Config folder Structure", ()=>{
    let filesList = ["index.js", "test.js", "development.js", "production.js", "staging.js"];
    let folder = path.join(__folder, "config");
    filesList.forEach((name)=>{
      it("Contains file: "+chalk.bold(name), ()=>{
        expect(file(path.join(folder, name))).to.exist;
      });
    });
  });

  describe("Framework folder Structure", ()=>{
    let filesList = ["bootstrap.js", "express.js", "utils.js", "routes.js"];
    let folder = path.join(__folder, "framework");
    filesList.forEach((name)=>{
      it("Contains file: "+chalk.bold(name), ()=>{
        expect(file(path.join(folder, name))).to.exist;
      });
    });
  });

  describe("Check root files", ()=>{
    let filesList = [".gitignore", "server.js"];
    filesList.forEach((name)=>{
      it("Contains file: "+chalk.bold(name), ()=>{
        expect(file(path.join(__folder, name))).to.exist;
      });
    });
  });

  // describe

  // describe("config folder", function(){
  //   let folder = path.join(__folder, "config");
  //   it("contains index.js", ()=>{
  //     expect(file(path.join(folder, "index.js"))).to.exist;
  //   });

  //   expect(file(path.join(folder, "development.js"))).to.exist;
  //   expect(file(path.join(folder, "test.js"))).to.exist;
  // });
});


