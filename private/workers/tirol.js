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
        var value = _.get(gauge, ['values', 'W', '15m.Cmd.HD', 'v']);
        result.push({
          name: gauge.name + '/' + gauge.WTO_OBJECT,
          code: gauge.number,
          altitude: Number(gauge.altitude),
          latitude: Number(gauge.latitude),
          longitude: Number(gauge.longitude),
          timestamp: _.get(gauge, ['values', 'W', '15m.Cmd.HD', 'dt']),
          value: value,
          disabled: value === undefined
        });
      }
      return result;
    });
}

if (process.argv[1] === 'autofill'){
  harvest()
    .then(function(gauges){
      process.stdout.write(gauges);
    })
    .catch(function(error){
      process.stderr.write(error);
      process.exit(1);
    });
}