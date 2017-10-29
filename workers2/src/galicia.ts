import parse from 'date-fns/esm/parse';
import find from 'lodash-es/find';
import { getJson, launchWorker } from './core';

// http://servizos.meteogalicia.es/rss/observacion/jsonAforos.action
async function harvest() {
  console.log('Harvesting');
  const json = await getJson('http://servizos.meteogalicia.es/rss/observacion/jsonAforos.action') as any;
  return json.listaAforos.map((gauge: any) => {
    const levelValue = find(gauge.listaMedidas, { codParametro: 1 });
    const flowValue = find(gauge.listaMedidas, { codParametro: 4 });
    return {
      name: gauge.nomeEstacion,
      code: gauge.ide,
      location: {
        type: 'Point',
        kind: 'gauge',
        coordinates: [
          Number(gauge.lonxitude),
          Number(gauge.latitude),
        ],
      },
      levelUnit: levelValue ? levelValue.unidade : 'm',
      flowUnit: flowValue ? flowValue.unidade : 'm3/s',
      timestamp: parse(gauge.dataUTC).valueOf(), // unix timestamp in ms
      level: levelValue ? levelValue.valor : 0,
      flow: flowValue ? flowValue.valor : 0,
      url: 'http://www2.meteogalicia.gal/servizos/AugasdeGalicia/estacionsinfo.asp?Nest=' + gauge.ide,
    };
  });
}

launchWorker(
  'allAtOnce',
  async (callback) => {
    try {
      const gauges = await harvest();
      callback(null, gauges);
    } catch (error) {
      callback(error, null);
    }
  },
  async (options, callback) => {
    try {
      const gauges = await harvest();
      const measurements = gauges.map((g: any) => ({
        code: g.code,
        timestamp: new Date(g.timestamp),
        level: g.level,
        flow: g.flow,
      }));
      callback(null, measurements);
    } catch (error) {
      callback(error, null);
    }
  },
);
