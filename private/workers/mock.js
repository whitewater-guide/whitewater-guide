if (process.argv[2] === 'autofill'){
  process.send([{
    name: 'Test gauge',
    code: '001',
    altitude: 100,
    latitude: 43,
    longitude: 10,
    timestamp: 0,//unix timestamp in ms
    value: Math.random() * 100,
    url: 'https://ya.ru',
    disabled: false
  }]);
}
else if (process.argv[2] === 'harvest'){
  setTimeout(function(){
    process.send({
      timestamp: new Date().today.getUTCSeconds(),
      value: Math.random() * 100
    });
  }, 100);
}