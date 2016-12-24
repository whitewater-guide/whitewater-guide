//http://www2.nve.no/h/hd/plotreal/H/list.html
var fetch = require('node-fetch');
var cheerio = require('cheerio');
var queue = require('queue');
var moment = require('moment');
var _ = require('lodash');
require('console.table');

var URL_BASE = 'http://www2.nve.no/h/hd/plotreal/H/';
var URL = URL_BASE + 'list.html';

function parseGaugesListHTML(callback){
  fetch(URL)
    .then(function(res) {return res.text()})
    .then(function (res){
      var $ = cheerio.load(res);

      var rows = $('table').first().find('tr');
      var result = [];
      rows.each(function(index){
        if (index > 0){
          var tds = $(this).find('td');
          var row = {
            name: tds.eq(0).text(),
            code: tds.eq(1).text(),
            url: URL_BASE + tds.eq(0).find('a').first().attr('href'),
            location: {
              type: 'Point',
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
      process.send(gauges);
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
      console.log(`Error while harvesting: ${error}`);
      process.send({error: error});
      process.exit(1);
    });
}
