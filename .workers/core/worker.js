const commandLineArgs = require('command-line-args');
require('console.table');

//Options that are passed to harvestHandler must be have same names as in JSON message
const optionDefinitions = [
  { name: 'verbose', type: Boolean },
  { name: 'version', alias: 'v', type: Number },
  { name: 'mode', type: String, defaultOption: true },
  { name: 'code', alias: 'c', type: String }, //Gauge code
];

function parseArgs(){
  return commandLineArgs(optionDefinitions);
}

function launchWorker(harvestMode, autofillHandler, harvestHandler) {
  //Must call 'exit' explicitly
  process.stdin.resume();

  const options = parseArgs();

  if (options.mode === 'describe'){
    process.stdout.write(JSON.stringify({harvestMode}));
    process.exit(0);
  }
  else if (options.mode === 'autofill'){
    autofillHandler(function onAutofillComplete(error, gauges) {
      if (error){
        process.send({error});
      }
      else if (options.verbose) {
        console.table(gauges);
      }
      else {
        process.send(gauges);
      }
      process.exit(error ? 1 : 0);
    });
  }
  else if (options.mode === 'harvest') {
    const messageHandler = message => {
      harvestHandler(
        message,
        function onHarvestComplete(error, measurements) {
          if (error) {
            process.send({error});
          }
          else if (options.verbose) {
            console.table(measurements);
          }
          else {
            process.send(measurements);
          }
          process.exit(error ? 1 : 0);
        }
      );
    };
    //Worker process awaits message with harvesting options
    if (options.verbose){
      messageHandler(options);
    }
    else {
      process.on('message', messageHandler);
    }
  }
}

module.exports = launchWorker;