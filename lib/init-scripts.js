"use strict";

var exec = require('child_process').exec;
var chalk = require('chalk');

var Ora = require('ora');
var spinner = new Ora({
  text: chalk.cyan.bold("Installing dependencies"),
  spinner: "dependencies"
});

var gitInit = function(){
  console.log(chalk.cyan.bold("Initialising git repository"));
  return new Promise(function(resolve){
    exec("git init",function(err, stdout, stderr){
      console.log(chalk.green("Git repository initialised"));
      resolve();
    }).stdout.pipe(process.stdout);
  });
}

var gitAddRemote = function(){
  return new Promise(function(resolve){
    if(npmconfig.git.indexOf("git")===-1){
      return resolve();
    }
    console.log(chalk.cyan.bold("Linking git repository"));
    exec("git remote add origin "+npmconfig.git, function(err, stdout, stderr){
      console.log(chalk.green("Remote repository linked"));
      resolve();
    }).stdout.pipe(process.stdout);
  });
}

var installForever = function(){
  console.log(chalk.cyan.bold("Installing forever.js"));
  return new Promise(function(resolve){
    exec("npm install -g forever", function(err, stdout, stderr){
      console.log(chalk.green("Installed forever.js"));
      resolve();
    }).stdout.pipe(process.stdout);
  });
}

var npmInstall = function(){
  // console.log(chalk.cyan.bold("Installing dependencies"));
  return new Promise(function(resolve){

    spinner.start();

    exec("npm install", function(err, stdout, stderr){
      if(err){
        spinner.text = chalk.red("Error installing dependencies:");
        spinner.fail();
        console.log(err);
        console.log(chalk.red("----------------------------------------"));
        return resolve();
      }
      spinner.text = chalk.green("Installed dependencies");
      spinner.succeed();
      // console.log(chalk.green("Installed dependencies"));
      resolve();
    }).stdout.pipe(process.stdout);
  });
}

var runScripts = function(){
  return new Promise(function(resolve){
    gitInit()
    .then(gitAddRemote)
    // .then(installForever)
    .then(npmInstall)
    .then(function(){
      console.log(chalk.yellow("Project setup complete. Start the app using "+chalk.bold("npm start")));
      resolve();
    });
  });
}

module.exports = runScripts;
