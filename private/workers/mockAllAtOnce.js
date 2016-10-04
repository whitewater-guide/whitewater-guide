if (process.argv[2] === 'autofill'){
  process.send([
    {
      name: 'Test gauge 1',
      code: '001',
      altitude: 100,
      latitude: 43,
      longitude: 10,
      timestamp: Date.now(),//unix timestamp in ms
      value: Math.random() * 100,
      url: 'https://ya.ru',
      disabled: false
    },
    {
      name: 'Test gauge 2',
      code: '002',
      altitude: 200,
      latitude: 11,
      longitude: 22,
      timestamp: Date.now(),//unix timestamp in ms
      value: 100+Math.random() * 100,
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
        value: Math.random() * 100
      },
      {
        code: '002',
        timestamp: Date.now(),
        value: 100+Math.random() * 100
      }
    ]);
  }, 100);
}