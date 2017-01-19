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
 **/

var fetch = require('node-fetch');
var cheerio = require('cheerio');
var queue = require('queue');
var moment = require('moment');
var iconv = require('iconv-lite');
var _ = require('lodash');
require('console.table');

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

function harvestGauge(code, lastTimestamp) {
  //Defaults to -1 day from now
  var time = lastTimestamp === undefined ? '-1;0' : (
    moment(Number(lastTimestamp)).format('YYYYMMDDTHHmm') + ';' + moment().format('YYYYMMDDTHHmm')
  );
  var paddedCode = code + '.0.1001.1';
  var gaugeUrl =
    'http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time=' +
    time + '&lang=no&chd=ds=htsr,da=29,id=' + paddedCode + ',rt=0&nocache=' + Math.random();
  //Example (no cache parameter)
  // http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time=-1;0&lang=no&chd=ds=htsr,da=29,id=2.32.0.1001.1,rt=0&nocache=1234
  
  return fetch(gaugeUrl)
    .then(function (response) { return response.json() })
    .then(function (json) {
      var measurements = _.get(json, ['0', 'SeriesPoints']);
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

if (process.argv[2] === 'describe'){
  process.stdout.write(JSON.stringify(
    {harvestMode: 'oneByOne'}
  ));
}
else if (process.argv[2] === 'autofill') {
  autofill(function (error, gauges) {
    if (error) {
      process.send({ error });
      process.exit(1);
    }
    else {
      if (process.argv[3] === 'list'){
        console.table(gauges);
      }
      else {
        process.send(gauges);
      }
      // console.log(gauges.length);
      // gauges.forEach(function(g){
      //   console.log(g.name + '\t----\t' + JSON.stringify(g));
      // })
    }
  });
}
else if (process.argv[2] === 'harvest') {
  harvestGauge(process.argv[3], process.argv[4])
    .then(function (measurements) {
      //console.log(`Successfully harvested ${JSON.stringify(measurements)}`);
      process.send(measurements);
    })
    .catch(function (error) {
      console.error(`Error while harvesting: ${error}`);
      process.send({error: error});
      process.exit(1);
    });
}
