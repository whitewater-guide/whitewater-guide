const cheerio = require('cheerio');
const axios = require('axios');
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support');
const tough = require('tough-cookie');
const capitalize = require('lodash/capitalize');
const words = require('lodash/words');
const moment = require('moment');
const queue = require('queue');
const launchWorker = require('./core/worker');
const utmToLatLng = require('./core/utmToLatLng');

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
const URL_BASE = 'http://saih.chminosil.es/';

// Because axios loses baseURL on relative redirects
axios.interceptors.request.use(function(config) {
  if ( !/^(?:\w+:)\/\//.test(config.url) ) {
    config.url = URL_BASE + config.url;
  }
  return config;
});

function harvest() {
  return axios.get('index.php', {
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
  }).then(response => {
    const stationRegexp = /^([A-Z]\d{3})\s-\s(.*)/;
    const $ = cheerio.load(response.data);
    const rows = $('tr').nextAll().map((i, el) => {
      const cols = $(el).find('td');
      const station = cols.eq(1).text();
      const level = cols.eq(5).text();
      const date = cols.eq(6).text();
      let [full, code, name] = stationRegexp.exec(station);
      name = words(name)
        .map(word => (word === 'EN' || word === 'DE') ? word.toLowerCase(): capitalize(word))
        .join(' ');
      const url = `http://saih.chminosil.es/index.php?url=/datos/ficha/estacion:${code}`;
      const timestamp = moment(date, 'DD/MM/YYYY HH:mm').valueOf();
      return {
        code,
        name,
        level,
        timestamp,
        url,
        levelUnit: 'm',
      };
    }).get();
    return rows;
  });
}

function parseGaugePage(url) {
  return axios.get(url, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
    maxRedirects: 10,
    jar: cookieJar,
    withCredentials: true,
  }).then(response => {
    const $ = cheerio.load(response.data);
    const locEl = $('td')
      .filter((i, el) => {
        const td = $(el);
        return td.attr('class') === 'celdac' && td.attr('colspan') === '2';
      })
      .first();
    const zone = parseInt(locEl.text());
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
      }
    };
  });
}

function autofill(autofillCallback) {
  harvest()
    .then(gauges => {
      const q = new queue({ concurrency: 3 });
      gauges.forEach(gauge => q.push(function(qcb){
        parseGaugePage(gauge.url)
          .then(({ location }) => {
            gauge.location = location;
            qcb();
          })
          .catch(error => {
            console.error(error);
            qcb();
          })
      }));
      q.start(function(e){
        autofillCallback(e, gauges);
      });
    })
    .catch(error => autofillCallback(error));
}

launchWorker(
  'allAtOnce',
  autofill,
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
