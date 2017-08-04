const random = require('lodash/random');
const padStart = require('lodash/padStart');

function generateRandomGauge(index) {
  return {
    name: `Test gauge ${index}`,
    code: padStart(index.toString(), 3, '0'),
    location: {
      type: 'Point',
      coordinates: [
        random(-179.9, 179.9, true),
        random(-89.9, 89.9, true),
        random(0, 3000),
      ],
      kind: 'gauge'
    },
    timestamp: Date.now(),//unix timestamp in ms
    level: Math.random() * 100,
    flow: Math.random() * 100,
    url: 'https://ya.ru',
    enabled: false
  };
}

function generateMeasurement(code, fixedValue) {
  return {
    code: code,
    timestamp: Date.now(),//unix timestamp in ms
    level: fixedValue || (Math.random() * 100),
    flow: fixedValue || (Math.random() * 100)
  };
}

module.exports = {
  generateRandomGauge,
  generateMeasurement,
};