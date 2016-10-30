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
        var measurement = _.find(gauge.listaMedidas, { codParametro: 1 });
        result.push({
          name: gauge.nomeEstacion,
          code: gauge.ide,
          location: {
            type: 'Point',
            coordinates: [
              Number(gauge.lonxitude),
              Number(gauge.latitude)
            ]
          },
          timestamp: moment(gauge.dataUTC).valueOf(),//unix timestamp in ms
          value: measurement ? measurement.valor : undefined,
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
          value: g.value,
        };
      });
      process.send(values)
    })
    .catch(function(error){
      process.send({error});
      process.exit(1);
    });
}
