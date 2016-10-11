var _ = require('lodash');


if (process.argv[2] === 'autofill') {
  var gauges = _.times(60, function (i) {
    return {
      name: `Test gauge ${i}`,
      code: i.toString(),
      altitude: 100,
      latitude: 43,
      longitude: 10,
      timestamp: Date.now(),//unix timestamp in ms
      value: Math.random() * 100,
      url: 'https://ya.ru',
      disabled: false
    }
  });
  process.send(gauges);
}
else if (process.argv[2] === 'harvest') {
  var measurements = [
    {
      code: process.argv[3],
      timestamp: Date.now(),//unix timestamp in ms
      value: Math.random() * 100
    }
  ];
  setTimeout(function(){
    process.send(measurements);
  }, 100);
}