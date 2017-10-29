import commandLineArgs from 'command-line-args';
// tslint:disable-next-line:no-import-side-effect
import 'console.table';
import { AutofillHandler, HarvestHandler } from './types';

declare global {
  interface Console {
    table: (val: any) => void;
  }
}

// Options that are passed to harvestHandler must be have same names as in JSON message
// Worker can be esecuted from console like this: `node galicia.js harvest --verbose`
const optionDefinitions = [
  { name: 'verbose', type: Boolean },
  { name: 'version', alias: 'v', type: Number },
  { name: 'mode', type: String, defaultOption: true },
  { name: 'code', alias: 'c', type: String }, // Gauge code
];

function parseArgs() {
  return commandLineArgs(optionDefinitions);
}

type HarvestMode = 'allAtOnce' | 'oneByOne';

export function launchWorker(
  harvestMode: HarvestMode,
  autofillHandler: AutofillHandler,
  harvestHandler: HarvestHandler,
) {
  // Must call 'exit' explicitly
  process.stdin.resume();

  const options = parseArgs();

  if (options.mode === 'describe') {
    process.stdout.write(JSON.stringify({ harvestMode }));
    process.exit(0);
  } else if (options.mode === 'autofill') {
    autofillHandler((error, gauges) => {
      if (error) {
        process.send!({ error }, () => process.exit(1));
      } else if (options.verbose) {
        console.table(gauges);
        process!.exit(0);
      } else {
        process.send!(gauges, () => process.exit(0));
      }
    });
  } else if (options.mode === 'harvest') {
    const messageHandler = (message: object) => {
      harvestHandler(
        message,
        (error, measurements) => {
          if (error) {
            if (options.verbose) {
              console.error(error);
              process.exit(1);
            } else {
              process.send!({ error }, () => process.exit(1));
            }
          } else if (options.verbose) {
            console.table(measurements || []);
            process.exit(0);
          } else {
            // Sort by timestamp ASC
            let result = measurements ? measurements.sort((a, b) => a.timestamp - b.timestamp) : [];
            if (options.lastTimestamp) { // If lastTimestamp is set, filter only most recent values
              result = result.filter(m => m.timestamp > options.lastTimestamp);
            }
            process.send!(result, () => process.exit(0));
          }
        },
      );
    };
    // Worker process awaits message with harvesting options
    if (options.verbose) {
      messageHandler(options);
    } else {
      process.on('message', messageHandler);
    }
  }
}
