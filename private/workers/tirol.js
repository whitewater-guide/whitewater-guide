import fetch from 'node-fetch';
import _ from 'lodash';
import 'console.table';

//https://apps.tirol.gv.at/hydro/#/Wasserstand/?station=201475
export default function harvest(){
  return fetch('https://apps.tirol.gv.at/hydro/stationdata/data.json')
    .then(response => response.json())
    .then(json => {
      const numGauges = json.length;
      const table = [];
      for (let i = 0; i < numGauges; i++){
        let gauge = json[i];
        table.push({
          gid: gauge.number,
          gin: Number(gauge.number),
          name: `${gauge.name} / ${gauge.WTO_OBJECT}`,
          altitude: gauge.altitude,
          latitude: gauge.latitude,
          longitude: gauge.longitude,
          timestamp: _.get(gauge, ['values', 'W', '15m.Cmd.HD', 'dt']),
          value: _.get(gauge, ['values', 'W', '15m.Cmd.HD', 'v']),
        });
      }
      console.table(table);
    });
}