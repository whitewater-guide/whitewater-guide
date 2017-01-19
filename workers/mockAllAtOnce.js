if (process.argv[2] === 'describe'){
  process.stdout.write(JSON.stringify(
    {harvestMode: 'allAtOnce'}
  ));
}
else if (process.argv[2] === 'autofill'){
  process.send([
    {
      name: 'Test gauge 1',
      code: '001',
      location: {
        type: 'Point',
        altitude: 100,
        coordinates: [
          43, 10
        ]
      },
      timestamp: Date.now(),//unix timestamp in ms
      level: Math.random() * 100,
      flow: Math.random() * 100,
      url: 'https://ya.ru',
      disabled: false
    },
    {
      name: 'Test gauge 2',
      code: '002',
      location: {
        altitude: 200,
        type: 'Point',
        coordinates: [11, 22]
      },
      timestamp: Date.now(),//unix timestamp in ms
      level: 100+Math.random() * 100,
      flow: 100+Math.random() * 100,
      url: 'https://ya.ru',
      disabled: false
    },    
  ]);
}
else if (process.argv[2] === 'harvest'){
  setTimeout(function(){
    process.send([
      {
        code: '001',
        timestamp: Date.now(),
        level: Math.random() * 100,
        flow: Math.random() * 100
      },
      {
        code: '002',
        timestamp: Date.now(),
        level: 100+Math.random() * 100,
        flow: 100+Math.random() * 100
      }
    ]);
  }, 100);
}