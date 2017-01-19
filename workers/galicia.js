//http://servizos.meteogalicia.es/rss/observacion/jsonAforos.action
var fetch = require('node-fetch');
var _ = require('lodash');
var moment = require('moment');

function harvest(){
  return fetch('http://servizos.meteogalicia.es/rss/observacion/jsonAforos.action')
    .then(function(response){ 
      return response.json();
    })
    .then(function (json) {
      var gauges = json.listaAforos;
      var numGauges = gauges.length;
      var result = [];
      for (var i = 0; i < numGauges; i++){
        var gauge = gauges[i];
        var levelValue = _.find(gauge.listaMedidas, { codParametro: 1 });
        var flowValue = _.find(gauge.listaMedidas, { codParametro: 4 });
        result.push({
          name: gauge.nomeEstacion,
          code: gauge.ide,
          location: {
            type: 'Point',
            kind: 'gauge',
            coordinates: [
              Number(gauge.lonxitude),
              Number(gauge.latitude)
            ]
          },
          levelUnit: levelValue ? levelValue.unidade : 'm',
          flowUnit: flowValue ? flowValue.unidade : 'm3/s',
          timestamp: moment(gauge.dataUTC).valueOf(),//unix timestamp in ms
          level: levelValue ? levelValue.valor : 0,
          flow: flowValue ? flowValue.valor : 0,
          url: 'http://www2.meteogalicia.gal/servizos/AugasdeGalicia/estacionsinfo.asp?Nest=' + gauge.ide
        });
      }
      return result;
    });
}

if (process.argv[2] === 'describe'){
  process.stdout.write(JSON.stringify(
    {harvestMode: 'allAtOnce'}
  ));
}
else if (process.argv[2] === 'autofill'){
  harvest()
    .then(function(gauges){
      process.send(gauges);
    })
    .catch(function(error){
      process.send({error});
      process.exit(1);
    });
}
else if (process.argv[2] === 'harvest') {
  harvest()
    .then(function (gauges) {
      var values = gauges.map(function (g) {
        return {
          code: g.code,
          timestamp: new Date(g.timestamp),
          level: g.level,
          flow: g.flow,
        };
      });
      process.send(values)
    })
    .catch(function(error){
      process.send({error});
      process.exit(1);
    });
}
