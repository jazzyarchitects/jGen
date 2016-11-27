"use strict";

const exec = require('child_process').exec;
const path = require('path');

var startProcess = function startProcess(){
  deleteFolder()
  .then(createFolder)
  .then(jgenInit)
  // .then(mocha)
  .then(()=>{
    console.log("Finished testing");
    process.exit(0);
  });
};

var mocha = function mocha(){
  return new Promise((resolve, reject)=>{
    exec("mocha --grep folder-structure.js", (err, stdout, stderr)=>{
      resolve();
    }).stdout.pipe(process.stdout);
  });
};

var jgenInit = function jgen(){
  return new Promise((resolve, reject)=>{
    exec("jgen init ../test/npm-response.json", {cwd: path.join(process.cwd(), "mocha-test"), env: process.env, stdio: ['\n\n\n\n\n\n\n\n\n\n', 'pipe', 'pipe']}, (err, stdout, stderr)=>{
      resolve();
    }).stdout.pipe(process.stdout);
  });
};

var createFolder = function createFolder(){
  return new Promise((resolve, reject)=>{
    exec("mkdir mocha-test", (err, stdout, stderr)=>{
    resolve();
  }).stdout.pipe(process.stdout);
  });
};

var deleteFolder = function deleteFolder(){
  return new Promise((resolve, reject)=>{
    exec("rm -rf mocha-test/", (err, stdout, stderr)=>{
      resolve();
    });
  });
};

module.exports = startProcess;

if(require.main === module){
  startProcess();
}
