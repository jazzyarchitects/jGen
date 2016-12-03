'use strict';

const config = require('./config');
const chalk = require('chalk');
const cluster = require('cluster');
const chokidar = require('chokidar');
let app = undefined;

const server_port = config.server.port;

exports.start = (isTest)=>{
  if(isTest===undefined){
    config.db.uri = config.db.uri+"_test";
  }
  app = require('./framework/bootstrap')(config);
  app.listen(server_port, function () {
    console.log(chalk.red.bold("Server running at port: "+server_port));
  });

  // Master-Worker communication
  process.on('message', function(message) {
    if(message.command === 'shutdown' && message.from === 'master') {
      process.exit(0);
    }
  });
};

exports.close = ()=> {
  app.close();
};


process.on('unhandledRejection', (reason, p) => {
  console.log(chalk.red("Unhandled Rejection at: Promise "), p, chalk.red(" reason: "), chalk.red(reason));
});

process.on('unhandledException', (error, m)=> {
  console.log(chalk.red("Unhandled Exception at: Error "), m, chalk.red(" reason: "), chalk.red(error));
})


/*--------------------------------------------------------CRITICAL SECTION-----------------------------------------------------------------*/

/**
* Following section creates worker processess to enable load balancing.
* Multiple servers allow us to update the server code without stopping the server.
* If you do not need 100% uptime, i.e. stop the server while updating, then delete this whole section.
*
* Cheers
**/
if(cluster.isMaster){

  //Watcher for no downtime updatation
  let watcher = chokidar.watch('.',{
    // ignored: ['tmp/*', 'node_modules/*'],       //Uncomment this line and comment the next line if ENOSPC error still persists after changing watch limit
    ignored: ['tmp/*'],
    persistent: true,
    ignoreInitial: true,
    cwd: '.',
    depth: 99,
    interval: 100
  }).on('all', restartWorkers);

  // Get number of CPUs
  let numWorkers = require('os').cpus().length;

  //We require atleast 2 worker threads to ensure no downtime
  if(numWorkers === 1){
    numWorkers *= 2;
  }

  console.log(chalk.yellow("Master setting up "+numWorkers+" workers"));

  //Create worker threads (New code will be applied when forking);
  for(let i=0;i<numWorkers;i++){
    cluster.fork();
  }

  cluster.on('online', (worker)=>{
    console.log(chalk.magenta("Worker thread: "+worker.process.pid+" is online"));
  });

  //This ensure app restarts if it crashes
  cluster.on('exit', (worker, code, signal)=>{
    console.log(chalk.red('Worker thread: '+worker.process.pid+" is exiting"));
    cluster.fork();
  });
}else{
  exports.start(false);
}

/**
* Following section stops the threads one by one at 5s intervals for a fail safe mechanism to ensure that atleast one worker is always running
**/
let workerIds = [];
function restartWorkers(event, path){
  for(let wid in cluster.workers){
    workerIds.push(wid)
  }
  stopWorker();
}

function stopWorker(){
  if(workerIds.length<=0){
    return;
  }
  if(Object.keys(cluster.workers).length>0){
    let wid = workerIds.pop();
    cluster.workers[wid].send({
      command: 'shutdown',
      from: 'master'
    });
    setTimeout(()=>{
      if(cluster.workers[wid]){
        cluster.workers[wid].process.kill('SIGKILL');
      }
    }, 20*1000);
  }
  setTimeout(stopWorker, 5*1000);
}
