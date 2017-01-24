var fetch = require('node-fetch');
var get = require('lodash/get');
var launchWorker = require('./core/worker');

//https://apps.tirol.gv.at/hydro/#/Wasserstand/?station=201475
function harvest(){
  return fetch('https://apps.tirol.gv.at/hydro/stationdata/data.json')
    .then(function(response){ 
      return response.json();
    })
    .then(function(json) {
      var numGauges = json.length;
      var result = [];
      for (var i = 0; i < numGauges; i++){
        var gauge = json[i];
        var levelValue = get(gauge, ['values', 'W', '15m.Cmd.HD', 'v'], 0);
        var flowValue = get(gauge, ['values', 'Q', '15m.Cmd.HD', 'v'], 0);
        result.push({
          name: gauge.name + '/' + gauge.WTO_OBJECT,
          code: gauge.number,
          location: {
            type: 'Point',
            kind: 'gauge',
            altitude: Number(gauge.altitude),
            coordinates: [
              Number(gauge.longitude),
              Number(gauge.latitude)
            ]
          },
          timestamp: Number(get(gauge, ['values', 'W', '15m.Cmd.HD', 'dt'])),//unix timestamp in ms
          level: levelValue,
          flow: flowValue,
          levelUnit: get(gauge, ['values', 'W', '15m.Cmd.HD', 'unit'], 'cm'),
          flowUnit: get(gauge, ['values', 'Q', '15m.Cmd.HD', 'unit'], 'm3/s'),
          url: 'https://apps.tirol.gv.at/hydro/#/Wasserstand/?station=' + gauge.number,
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
        var measurements = gauges.map(g => (
          {
            code: g.code,
            timestamp: new Date(g.timestamp),
            level: g.level,
            flow: g.flow,
          }
        ));
        callback(null, measurements);
      })
      .catch(error => callback(error, null));
  }
);
