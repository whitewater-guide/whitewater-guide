//http://www2.nve.no/h/hd/plotreal/H/list.html
var fetch = require('node-fetch');
var needle = require('needle');
var cheerio = require('cheerio');
var queue = require('queue');
var moment = require('moment');
var _ = require('lodash');
require('console.table');

var URL_BASE = 'http://www2.nve.no/h/hd/plotreal/H/';
var URL = URL_BASE + 'list.html';

function parseGaugesListHTML(callback){
  needle.get(URL, function(err, res){
      if (err){
        callback(err);
        return;
      }
      
      var $ = cheerio.load(res.body);

      var rows = $('table').first().find('tr');
      var result = [];
      rows.each(function(index){
        if (index > 0){
          var tds = $(this).find('td');
          var row = {
            name: tds.eq(0).text(),
            code: tds.eq(1).text(),
            url: URL_BASE + tds.eq(0).find('a').first().attr('href'),
            altitude: Number(tds.eq(2).text().replace('m','')),
            timestamp: moment(tds.eq(5).text(), 'DD.MM.YYYY HH:mm').valueOf()//unix timestamp in ms
          };
          result.push(row);
        }
      });
      //This is limit for tests
      result = _.take(result, 40);
      callback(undefined, result);
  });
}

function scrapGaugePage(gaugeURL, callback){
  needle.get(gaugeURL, function(err, res){
      if (err) {
        callback(err);
        return;
      }
      
      var $ = cheerio.load(res.body);

      var pre = $('pre').first().contents();
      var longitude = pre
        .filter(function() {
          return this.nodeType === 3 && $(this).text().indexOf('Lengdegrad') >= 0;
        })
        .next()
        .text();

      var latitude = pre
        .filter(function() {
          return this.nodeType === 3 && $(this).text().indexOf('Breddegrad') >= 0;
        })
        .next()
        .text();

      callback(undefined, {latitude: latitude, longitude: longitude});
  });
}

function autofill(cb){
  parseGaugesListHTML(function(err, gauges){
    if (err){
      cb(err);
      return;
    }
    var q = new queue({concurrency: 5});
    gauges.forEach(function(gauge){
      q.push(function(qcb){
        scrapGaugePage(gauge.url, function(err, latlon){
          if (err){
            qcb();
            return;
          }
          gauge.latitude = latlon.latitude;
          gauge.longitude = latlon.longitude;
          qcb();
        });
      })
    });
    q.start(function(e){
      cb(e, gauges);
    });
  });
}

function harvestGauge(code, lastTimestamp) {
  //Defaults to -1 day from now
  var time = lastTimestamp === undefined ? '-1;0' : (
    moment(lastTimestamp).format('YYYYMMDDTHHmm') + ';' + moment().format('YYYYMMDDTHHmm')
  );
  var paddedCode = code + '.0.1000.1';
  var gaugeUrl =
    'http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time=' +
    time + '&lang=no&chd=ds=htsr,da=29,id=' + paddedCode + ',rt=0&nocache=' + Math.random();
  
  return fetch(gaugeUrl)
    .then(function (response) { return response.json() })
    .then(function (json) {
      var measurements = _.get(json, ['0', 'SeriesPoints']);
      measurements = measurements.map(function (m) {
        var keyRegex = /\/Date\(([0-9]*)\)\//g;
        return {
          code: code,
          value: m.Value,
          timestamp: new Date(Number(keyRegex.exec(m.Key)[1]))
        };
      });
      // console.log(`Fetched ${JSON.stringify(measurements)}`);
      return measurements;
    })
}

if (process.argv[2] === 'autofill') {
  autofill(function (error, gauges) {
    if (error) {
      process.send({ error });
      process.exit(1);
    }
    else {
      process.send(gauges);
    }
  });
}
else if (process.argv[2] === 'harvest') {
  harvestGauge(process.argv[3], process.argv[4])
    .then(function (measurements) {
      // console.log(`Successfully harvested ${JSON.stringify(measurements)}`);
      process.send(measurements);
    })
    .catch(function (error) {
      process.send({ error });
      process.exit(1);
    });
}
