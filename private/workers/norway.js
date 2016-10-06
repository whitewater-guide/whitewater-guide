//http://www2.nve.no/h/hd/plotreal/H/list.html
var needle = require('needle');
var cheerio = require('cheerio');
var queue = require('queue');
var moment = require('moment');
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
  //http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time=-1:0;0&lang=no&chd=ds=htsr,da=29,id=2.303.0.1000.1,rt=0&nocache=0.5432308182330388
}