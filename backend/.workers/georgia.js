var fetch = require('node-fetch');
var cheerio = require('cheerio');
var crypto = require('crypto');
var moment = require('moment');
var queue = require('queue');
var times = require('lodash/times');
var pick = require('lodash/pick');
var launchWorker = require('./core/worker');

const URL = 'http://meteo.gov.ge/index.php?l=2&pg=hd';
const headers = {
  'Accept-Language': 'en-US,en',
};

function harvest(lastTimestamp){
  const url = `${URL}&dd=${moment(lastTimestamp).format('YYYY-MM-D')}`;
  return fetch(url, { method: 'GET', headers })
    .then(function(res) {return res.text()})
    .then(function (body){
      var $ = cheerio.load(body);
      var results = [];
      $('td[background="images/hidro1.gif"]').each(function (i, elem) {
        var parent = $(this).parents('table').first();
        //console.log(parent.html());
        //console.log($(parent).find('.date2').html())
        const name = $('b', parent).text().trim();
        const level = $('.date2', parent).text();
        const cleanName = name.replace(/\W/g, '').toLowerCase();// Removes all non-alphanumeric chars
        const code = crypto.createHash('md5').update(cleanName).digest("hex");
        const data = {
          name,
          code,
          url: URL,
          levelUnit: 'cm',
          flowUnit: '',
          level,
          flow: 0,
          timestamp: moment(lastTimestamp).startOf('day'),
        };
        results.push(data);
      });
      return results;
    });
}

function harvestMany(callback) {
  var q = new queue({concurrency: 5});
  var results = [];
  times(14, function(i) {
    q.push(function(qcb){
      const when = moment().subtract(i, 'days').toDate();
      harvest(when)
        .then(function(daily) {results = results.concat(daily); qcb(); })
        .catch(function(err) { qcb(); })
    })
  });

  q.start(function(e){
    callback(e, results);
  });
}

function mapMeasurements(gauges) {
  return gauges
    .map(g => pick(g, ['code', 'timestamp', 'level', 'flow']))
    .sort((a,b) => (new Date(a.timestamp) - new Date(b.timestamp)));
}

launchWorker(
  'allAtOnce',
  function autofillHandler(callback) {
    harvest()
      .then(gauges => callback(null, gauges))
      .catch(error => callback(error, null));
  },
  function harvestHandler(options, callback) {
    if (options.lastTimestamp){
      //Ignore timestamp, harvest once
      harvest(Date.now())
        .then(gauges => callback(null, mapMeasurements(gauges)))
        .catch(error => callback(error, null));
    }
    else {
      harvestMany(function (error, results) {
        callback(error, results && mapMeasurements(results));
      })
    }
  }
);
