import cheerio from 'cheerio';
import axios from 'axios';
import axiosCookieJarSupport from '@3846masa/axios-cookiejar-support';
import parse from 'date-fns/esm/parse';
import capitalize from 'lodash-es/capitalize';
import words from 'lodash-es/words';
import queue from 'queue';
import tough from 'tough-cookie';
import { launchWorker, Location, utmToLatLng } from './core';
import { AutofillCallback, Gauge } from './core/types';

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
const URL_BASE = 'http://saih.chminosil.es/';

// tslint:disable-next-line:max-line-length
const DELIM_1 = '<!----------------------------------------------------------------------------- LINEA 1 ------------------------------------------------------------------>';
const DELIM_2 = '<!----------------------------------------------------------------------------- LINEA 2 ------------------------------------------------------------------>';

// Because axios loses baseURL on relative redirects
axios.interceptors.request.use((config) => {
  if (config.url && !/^(?:\w+:)\/\//.test(config.url)) {
    config.url = URL_BASE + config.url;
  }
  return config;
});

async function harvest(): Promise<Gauge[]> {
  const response = await axios.get('index.php', {
    baseURL: URL_BASE,
    params: {
      url: '/datos/resumen_excel',
    },
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
    maxRedirects: 10,
    jar: cookieJar,
    withCredentials: true,
  });
  const stationRegexp = /^([A-Z]\d{3})\s-\s(.*)/;
  const $ = cheerio.load(response.data);
  return $('tr').nextAll().map((i, el) => {
    const cols = $(el).find('td');
    const station = cols.eq(1).text();
    const level = parseFloat(cols.eq(5).text().replace(',', '.'));
    const date = cols.eq(6).text();
    const parts = stationRegexp.exec(station)!;
    const code = parts[1];
    const name = words(parts[2])
      .map(word => (word === 'EN' || word === 'DE') ? word.toLowerCase() : capitalize(word))
      .join(' ');
    const url = `http://saih.chminosil.es/index.php?url=/datos/ficha/estacion:${code}`;
    const timestamp = parse(date, 'DD/MM/YYYY HH:mm').valueOf();
    return {
      code,
      name,
      level: isNaN(level) ? 0 : level,
      flow: 0,
      timestamp,
      url,
      levelUnit: 'm',
    };
  }).get() as any;
}

async function parseGaugePage(url: string): Promise<{location?: Location}> {
  const response = await axios.get(url, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
    maxRedirects: 10,
    jar: cookieJar,
    withCredentials: true,
  });
  const html = response.data;
  let startIndex = html.indexOf(DELIM_1) + DELIM_1.length;
  let endIndex = html.indexOf(DELIM_2);
  if (startIndex === -1 || endIndex === -1) {
    return {};
  }
  let fragment = html.substring(startIndex, endIndex).trim();
  startIndex = fragment.indexOf('<tr>', 5);
  endIndex = fragment.indexOf('</tr>', startIndex) + 5;
  if (startIndex === -1 || endIndex === -1) {
    return {};
  }
  fragment = fragment.substring(startIndex, endIndex).trim();
  const $ = cheerio.load(fragment, { xmlMode: true });
  const locEl = $('td').filter((i, el) => {
    const td = $(el);
    return td.attr('class') === 'celdac' && td.attr('colspan') === '2';
  })
    .first();
  const zone = parseInt(locEl.text(), 10);
  const latEl = locEl.next();
  const lngEl = latEl.next();
  const altEl = lngEl.next();
  const { lat, lng } = utmToLatLng(parseFloat(latEl.text()), parseFloat(lngEl.text()), zone, true);
  return {
    location: {
      type: 'Point',
      kind: 'gauge',
      coordinates: [
        lng,
        lat,
        parseFloat(altEl.text()),
      ],
    },
  };
}

async function autofill(autofillCallback: AutofillCallback) {
  try {
    const gauges = await harvest();
    const q = new queue({ concurrency: 1 });
    gauges.forEach((gauge: Partial<Gauge>) => q.push(async () => {
      const { location } = await parseGaugePage(gauge.url!);
      gauge.location = location;
      global.gc();
    }));
    q.start((e: any) => {
      autofillCallback(e, gauges);
    });
  } catch (error) {
    console.error('Galicia2 autofill error', error);
    autofillCallback(error, null);
  }
}

launchWorker(
  'allAtOnce',
  autofill,
  async (options, callback) => {
    try {
      const gauges = await harvest();
      const measurements = gauges.map(g => ({
        code: g.code,
        timestamp: new Date(g.timestamp).valueOf(),
        level: g.level,
        flow: g.flow,
      }));
      callback(null, measurements);
    } catch (error) {
      callback(error, null);
    }
  },
);

// axios.get('http://saih.chminosil.es', {
//   headers: {
//     'Cache-Control': 'no-cache',
//     'Pragma': 'no-cache',
//   },
//   maxRedirects: 10,
//   jar: cookieJar,
//   withCredentials: true,
// }).then(() => {
//   parseGaugePage('http://saih.chminosil.es/index.php?url=/datos/ficha/estacion:N030')
//     .then(result => console.log(result));
// });
