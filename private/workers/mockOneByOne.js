var _ = require('lodash');


if (process.argv[2] === 'describe'){
  process.stdout.write(JSON.stringify(
    {harvestMode: 'oneByOne'}
  ));
}
else if (process.argv[2] === 'autofill') {
  var gauges = _.times(60, function (i) {
    return {
      name: `Test gauge ${i}`,
      code: i.toString(),
      location: {
        altitude: _.random(0, 3000),
        coordinates: [
          _.random(-89.9, 89.9, true),
          _.random(-179.9, 179.9, true)
        ]
      },
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