var times = require('lodash/times');
var launchWorker = require('./core/worker');
var {generateRandomMeasurement, generateRandomGauge} = require('./core/utils');

/**
 * This is mock worker that imitates work with source that provides
 * its measurements for all gauges at once.
 *
 * In order to work on production server, source code must be bundled, see gulpfile for this
 *
 */

launchWorker(
  'allAtOnce',
  function autofillHandler(callback) {
    const gauges = times(10, generateRandomGauge);
    setTimeout(() => callback(null, gauges), 300);
  },
  function harvestHandler(options, callback) {
    const measurements = times(10, i => generateRandomMeasurement(_.padStart(i.toString(), 3, '0')));
    setTimeout(() => callback(null, measurements), 300);
  }
);
