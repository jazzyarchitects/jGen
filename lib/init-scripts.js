"use strict";

const exec = require('child_process').exec;
const chalk = require('chalk');

const Ora = require('ora');
let spinner = new Ora({
  text: chalk.cyan.bold("Installing dependencies"),
  spinner: "dependencies"
});

let gitInit = function () {
  console.log(chalk.cyan.bold("Initialising git repository"));
  return new Promise(function (resolve) {
    exec("git init", function (err, stdout, stderr) {
      if (err) console.log(chalk.red(JSON.stringify(err)));
      console.log(chalk.green("Git repository initialised"));
      resolve();
    }).stdout.pipe(process.stdout);
  });
}

let gitAddRemote = function () {
  return new Promise(function (resolve) {
    if (global.npmconfig.git.indexOf("git") === -1) {
      return resolve();
    }
    console.log(chalk.cyan.bold("Linking git repository"));
    exec("git remote add origin " + global.npmconfig.git, function (err, stdout, stderr) {
      if (err) console.log(chalk.red(JSON.stringify(err)));
      console.log(chalk.green("Remote repository linked"));
      resolve();
    }).stdout.pipe(process.stdout);
  });
}

// let installForever = function () {
//   console.log(chalk.cyan.bold("Installing forever.js"));
//   return new Promise(function (resolve) {
//     exec("npm install -g forever", function (err, stdout, stderr) {
//       if (err) console.log(chalk.red(JSON.stringify(err)));
//       console.log(chalk.green("Installed forever.js"));
//       resolve();
//     }).stdout.pipe(process.stdout);
//   });
// }

let npmInstall = function () {
  return new Promise(function (resolve) {
    spinner.start();

    exec("npm install", function (err, stdout, stderr) {
      if (err) {
        spinner.text = chalk.red("Error installing dependencies:");
        spinner.fail();
        console.log(err);
        console.log(chalk.red("----------------------------------------"));
        return resolve();
      }
      spinner.text = chalk.green("Installed dependencies");
      spinner.succeed();
      resolve();
    }).stdout.pipe(process.stdout);
  });
}

let runScripts = function () {
  return new Promise(function (resolve) {
    gitInit()
    .then(gitAddRemote)
    // .then(installForever)
    .then(npmInstall)
    .then(function () {
      console.log(chalk.yellow("Project setup complete. Start the app using " + chalk.bold("npm start")));
      resolve();
    });
  });
}

module.exports = runScripts;
