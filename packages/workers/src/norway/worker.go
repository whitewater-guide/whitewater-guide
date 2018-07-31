package norway

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

import (
  "core"
  "fmt"
  "github.com/PuerkitoBio/goquery"
  log "github.com/sirupsen/logrus"
  "github.com/spf13/pflag"
  "golang.org/x/text/encoding/charmap"
  "io/ioutil"
  "math/rand"
  "strings"
  "time"
)

const (
  urlBase = "http://www2.nve.no/h/hd/plotreal/Q/"
  listUrl = urlBase + "list.html"
)

type workerNorway struct{}

func (w *workerNorway) ScriptName() string {
  return "norway"
}

func (w *workerNorway) HarvestMode() string {
  return core.OneByOne
}

func (w *workerNorway) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
  version, _ := flags.GetInt("version")
  html, _ := flags.GetBool("html")
  return map[string]interface{}{
    "version": version,
    "html":    html,
  }
}

func (w *workerNorway) Autofill() ([]core.GaugeInfo, error) {
  resp, err := core.Client.Get(listUrl)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  utfReader := charmap.ISO8859_1.NewDecoder().Reader(resp.Body)

  doc, err := goquery.NewDocumentFromReader(utfReader)
  if err != nil {
    return nil, err
  }
  gauges := parseList(*doc)

  jobsCh := make(chan listItem, len(gauges))
  resultsCh := make(chan core.GaugeInfo, len(gauges))
  results := make([]core.GaugeInfo, len(gauges))

  for i := 1; i <= 5; i++ {
    go w.gaugePageWorker(jobsCh, resultsCh)
  }
  for _, g := range gauges {
    jobsCh <- g
  }
  close(jobsCh)
  for i := range gauges {
    results[i] = <-resultsCh
  }
  close(resultsCh)
  return results, nil
}

func (w *workerNorway) Harvest(options core.HarvestOptions) ([]core.Measurement, error) {
  var version = 1
  var html = false
  if v, ok := options.Extras["version"]; ok && v != 0 {
    vint := v.(int)
    version = int(vint)
  }
  if v, ok := options.Extras["html"]; ok {
    html = v.(bool)
  }

  // Sometimes gauge JSON will contain message like "213.4.0 This station is not enabled for viewing - Ingen data"
  // In this case, set html flag to fallback to parsing raw pages
  // TODO: parse csv instead of html, as csv is 5kb vs 17
  if html {
    return w.harvestFromPage(options.Code)
  } else {
    return w.harvestFromJSON(options.Code, options.Since, version)
  }
}

func (w *workerNorway) harvestFromPage(code string) ([]core.Measurement, error) {
  // http://www2.nve.no/h/hd/plotreal/Q/0213.00004.000/index.html
  parts := strings.Split(code, ".")
  url := fmt.Sprintf("http://www2.nve.no/h/hd/plotreal/Q/%04v.%05v.000/index.html", parts[0], parts[1])
  raw, err := core.Client.GetAsString(url)
  if err != nil {
    return nil, err
  }
  page := parsePage(raw)
  m := core.Measurement{
    GaugeId: core.GaugeId{
      Script: w.ScriptName(),
      Code:   code,
    },
    Timestamp: core.HTime{Time: page.timestamp.Time.UTC()},
    Flow:      page.value,
  }
  return []core.Measurement{m}, nil
}

func (w *workerNorway) harvestFromJSON(code string, since int64, version int) ([]core.Measurement, error) {
  now := time.Now()
  url := "http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time="
  // It seems that this endpoint cannot filter by hours, only by days
  // So "since" parameter has daily granularity.
  // E.g. if you want to filter values from 15:00 yesterday, you will still get all values from today and yesterday
  // If you want to filter values from 13:00 today, you will still get values from 06:00 today, but none from yesterday
  // I keep it here anyway
  var sinceStr string
  if since == 0 {
    sinceStr = "-1;0"
  } else {
    sinceT := time.Unix(since, 0)
    sinceStr = sinceT.UTC().Format("20060102T1504") + ";0"
  }
  paddedCode := fmt.Sprintf("%s.0.1001.%d", code, version)
  url += sinceStr
  url += "&lang=no&chd=ds=htsr,da=29,id=" + paddedCode + ",rt=0"

  r := rand.New(rand.NewSource(now.Unix()))
  url += fmt.Sprintf("&nocache=%d", r.Int31n(1000))

  resp, err := core.Client.Get(url)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()

  bytes, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    return nil, err
  }
  measurements, err := parseRawJSON(w.ScriptName(), code, bytes)
  if err != nil {
    return nil, err
  }

  if len(measurements) == 0 {
    log.WithFields(log.Fields{
      "script":  w.ScriptName(),
      "command": "harvest",
      "code":    code,
      "since":   since,
      "url":     url,
    }).Warn("returned 0 measurements")
  }

  return measurements, nil
}

func (w *workerNorway) gaugePageWorker(gauges <-chan listItem, results chan<- core.GaugeInfo) {
  for gauge := range gauges {
    resp, err := core.Client.Get(gauge.href)
    result := core.GaugeInfo{
      GaugeId: core.GaugeId{
        Script: w.ScriptName(),
        Code:   gauge.id,
      },
      Name:     gauge.name,
      FlowUnit: "m3/s",
      Url:      gauge.href,
      Location: core.Location{
        Altitude: gauge.altitude,
      },
    }
    if err != nil {
      results <- core.GaugeInfo{}
      continue
    }
    bytes, err := ioutil.ReadAll(resp.Body)
    if err != nil {
      results <- core.GaugeInfo{}
      resp.Body.Close()
      continue
    }
    page := parsePage(string(bytes))
    result.Location.Longitude = page.longitude
    result.Location.Latitude = page.latitude
    results <- result
    resp.Body.Close()
  }
}

func NewWorkerNorway() core.Worker {
  return &workerNorway{}
}
