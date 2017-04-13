//http://servizos.meteogalicia.es/rss/observacion/jsonAforos.action
var fetch = require('node-fetch');
var find = require('lodash/find');
var moment = require('moment');
var launchWorker = require('./core/worker');

function harvest(){
  return fetch('http://servizos.meteogalicia.es/rss/observacion/jsonAforos.action')
    .then(function(response){
      return response.json();
    })
    .then(function (json) {
      console.log(json);
      var gauges = json.listaAforos;
      var numGauges = gauges.length;
      var result = [];
      for (var i = 0; i < numGauges; i++){
        var gauge = gauges[i];
        var levelValue = find(gauge.listaMedidas, { codParametro: 1 });
        var flowValue = find(gauge.listaMedidas, { codParametro: 4 });
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

launchWorker(
  'allAtOnce',
  function autofillHandler(callback) {
    harvest()
      .then(gauges => callback(null, gauges))
      .catch(error => callback(error, null));
  },
  function harvestHandler(options, callback) {
    harvest()
      .then(gauges => {
        var measurements = gauges.map(g => ({
          code: g.code,
          timestamp: new Date(g.timestamp),
          level: g.level,
          flow: g.flow,
        }));
        callback(null, measurements);
      })
      .catch(error => callback(error, null));
  }
);
