import padStart from 'lodash-es/padStart';
import times from 'lodash-es/times';
import { generateMeasurement, generateRandomGauge, launchWorker } from './core';

/**
 * This is mock worker that imitates work with source that provides
 * its measurements for all gauges at once.
 *
 * In order to work on production server, source code must be bundled, see gulpfile for this
 *
 */

launchWorker(
  'allAtOnce',
  (callback) => {
    const gauges = times(10, generateRandomGauge);
    setTimeout(() => callback(null, gauges), 300);
  },
  (options, callback) => {
    const measurements = times(
      10,
      i => generateMeasurement(padStart(i.toString(), 3, '0')),
    );
    setTimeout(() => callback(null, measurements), 300);
  },
);
