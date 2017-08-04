var times = require('lodash/times');
var launchWorker = require('./core/worker');
var {generateMeasurement, generateRandomGauge} = require('./core/utils');


/**
 * This is mock worker that imitates work with source that provides
 * its measurements on one gauge at a time basis.
 *
 * In order to work on production server, source code must be bundled, see gulpfile for this
 *
 */

launchWorker(
  'oneByOne',
  function autofillHandler(callback) {
    const gauges = times(60, generateRandomGauge);
    setTimeout(() => callback(null, gauges), 300);
  },
  function harvestHandler(options, callback) {
    const measurements = [generateMeasurement(options.code, options.fixedValue)];
    setTimeout(() => callback(null, measurements), 300);
  }
);