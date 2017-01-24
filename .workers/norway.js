/**
 * Take a look at senorge.no, NVEs portal for time series data.
 * Choose a theme, for instance «Vann».
 * Then on the right site, choose the menu “Stasjoner” and then “Vannstand”.
 * Click on a station (dot) on the map and time series plot will pop up.
 * At the bottom of this plot, you can choose to download the data in three formats; text, xml or json.*
 * The url is something like:
 * http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time=20160825T0000;20160923T0000&chd=ds=htsr,da=29,id=73.2.0.1000.2,rt=0,mth=inst*
 * Some notes about parameters:
 * • Time=<start>;<end>
 *    o Time period, which are specified as
 *      • exact date time
 *      • relative date time (as c# timespan)
 * • chd=ds=…|ds=…|ds==
 *    o Specify one or more time series to be used (chd means chart data, ds means data source)
 *    o Look at the url when hoovering over various stations.
 * • Id=<digit>.<digit>.<digit>.<digit>.<digit>
 *    o A 5 digit time series id. Digit no 4 should be 1000 for stage and 1001 for discharge*
 *
 * A note of the time attribute (Relative to current timestamp).
 * If you would like to have the last hour of data: time=-1:0;0, the last 6 hours: time=-6:0;0, the last day: time=-1;0
 * Time=-1:0;0  means DateTime.Now.Add(TimeSpan.Parse("-1:0")) or DateTime.Now.AddHour(-1)
 *
 * We do not have a public api for getting all available stations or time series.
 * You better use http://www2.nve.no/h/hd/plotreal/H/list.html to get a list of available stations. (by level)
 * http://www2.nve.no/h/hd/plotreal/Q/list.html (by flow)
 * In order to use the time series data, the origin of the data (NVE) must be visible in the app.
 *
 * Our stations has identity the first three digits, like 62.10,0.
 * Digit number four is the parameter; 1000 for stage, 1001 for discharge
 * Digit number 5 is a version number. Once in a while something changes at station requiring us to upgrade the version number to distinguish to various series.
 * That what’s happened here.
 *
 * The id=62.10.0.1000.1 must be id=62.0.1000.2.
 * The plotreal is based on version 2.
 *
 * So how can you figure out what version is being used?
 * It is not mentioned in plotreal because the version id confuse people.
 * If you go to xgeo.no, search for 62.10.0 you will find the station. Enable viewing vannstand (stage) and click on the point to show the graph,
 * On the left side of the graph you are able to see the versjon (version).
 **/

var fetch = require('node-fetch');
var cheerio = require('cheerio');
var queue = require('queue');
var moment = require('moment');
var iconv = require('iconv-lite');
var launchWorker = require('./core/worker');
var get = require('lodash/get');

var URL_BASE = 'http://www2.nve.no/h/hd/plotreal/Q/';
var URL = URL_BASE + 'list.html';

function parseGaugesListHTML(callback){
  fetch(URL)
    .then(function(res) {return res.buffer()})
    .then(function (buf) {
      return iconv.decode(buf, 'latin1');
    })
    .then(function (body){
      var $ = cheerio.load(body);

      var rows = $('table').first().find('tr');
      var result = [];
      rows.each(function(index){
        if (index > 0){
          var tds = $(this).find('td');
          var row = {
            name: tds.eq(0).text(),
            code: tds.eq(1).text(),
            url: URL_BASE + tds.eq(0).find('a').first().attr('href'),
            levelUnit: '',
            flowUnit: 'm3/s',
            location: {
              type: 'Point',
              kind: 'gauge',
              altitude: Number(tds.eq(2).text().replace('m', ''))
            },
            timestamp: moment(tds.eq(5).text(), 'DD.MM.YYYY HH:mm').valueOf()//unix timestamp in ms
          };
          if (row.location.altitude === null)
            delete row.location.altitude;
          result.push(row);
        }
      });
      //This is limit for tests
      //result = _.take(result, 20);
      callback(undefined, result);
  })
  .catch(function(err){
    callback(err);
  });
}

function scrapGaugePage(gaugeURL, callback){
  fetch(gaugeURL)
    .then(function(res){return res.text()})
    .then(function(res){
      var $ = cheerio.load(res);

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

      callback(undefined, [longitude, latitude]);
    })
    .catch(function(err){
      callback(err);
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
        scrapGaugePage(gauge.url, function(err, coordinates){
          if (err){
            qcb();
            return;
          }
          gauge.location.coordinates = coordinates;
          if (coordinates[0] === "" || coordinates[1] === "")
            delete gauge.location;
          qcb();
        });
      })
    });
    q.start(function(e){
      cb(e, gauges);
    });
  });
}

function harvestGauge(code, lastTimestamp, version = 1) {
  //Defaults to -1 day from now
  var time = lastTimestamp === undefined ? '-1;0' : (
    moment(lastTimestamp).format('YYYYMMDDTHHmm') + ';' + moment().format('YYYYMMDDTHHmm')
  );
  var paddedCode = code + '.0.1001.' + version;
  var gaugeUrl =
    'http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time=' +
    time + '&lang=no&chd=ds=htsr,da=29,id=' + paddedCode + ',rt=0&nocache=' + Math.random();
  //Example (no cache parameter)
  // http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time=-1;0&lang=no&chd=ds=htsr,da=29,id=2.32.0.1001.1,rt=0&nocache=1234
  return fetch(gaugeUrl)
    .then(function (response) { return response.json() })
    .then(function (json) {
      var measurements = get(json, ['0', 'SeriesPoints']);
      measurements = measurements.map(function (m) {
        var keyRegex = /\/Date\(([0-9]*)\)\//g;
        return {
          code: code,
          flow: m.Value,
          level: 0,
          timestamp: new Date(Number(keyRegex.exec(m.Key)[1]))
        };
      });
      console.log(`Fetched ${measurements.length} measurements from ${gaugeUrl}`);
      return measurements;
    })
}

launchWorker(
  'oneByOne',
  autofill,
  function harvestHandler(options, callback) {
    harvestGauge(options.code, options.lastTimestamp, options.version)
      .then(measurements => {
        callback(null, measurements);
      })
      .catch(error => {
        callback(error, null);
      });
  }
);