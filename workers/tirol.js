var fetch = require('node-fetch');
var _ = require('lodash');

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
        var levelValue = _.get(gauge, ['values', 'W', '15m.Cmd.HD', 'v'], 0);
        var flowValue = _.get(gauge, ['values', 'Q', '15m.Cmd.HD', 'v'], 0);
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
          timestamp: Number(_.get(gauge, ['values', 'W', '15m.Cmd.HD', 'dt'])),//unix timestamp in ms
          level: levelValue,
          flow: flowValue,
          levelUnit: _.get(gauge, ['values', 'W', '15m.Cmd.HD', 'unit'], 'cm'),
          flowUnit: _.get(gauge, ['values', 'Q', '15m.Cmd.HD', 'unit'], 'm3/s'),
          url: 'https://apps.tirol.gv.at/hydro/#/Wasserstand/?station=' + gauge.number,
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