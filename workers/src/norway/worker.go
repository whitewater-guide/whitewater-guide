package main

import (
  "core"
  "golang.org/x/text/encoding/charmap"
  "github.com/PuerkitoBio/goquery"
  "net/http"
  "io/ioutil"
  "github.com/spf13/pflag"
  "fmt"
  "time"
  "math/rand"
  "strings"
)

type worker struct {
  core.NamedWorker
}

const (
  urlBase = "http://www2.nve.no/h/hd/plotreal/Q/"
  listUrl = urlBase + "list.html"
)

func (w *worker) HarvestMode() string {
  return core.OneByOne
}

func (w *worker) Autofill() ([]core.GaugeInfo, error) {
  resp, err := http.Get(listUrl)
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

  for w := 1; w <= 5; w++ {
    go gaugePageWorker(jobsCh, resultsCh)
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

func (w *worker) Harvest(code string, since int64, flags *pflag.FlagSet) ([]core.Measurement, error) {
  version, _ := flags.GetString("version")
  html, _ := flags.GetBool("html")

  // Sometimes gauge JSON will contain message like "213.4.0 This station is not enabled for viewing - Ingen data"
  // In this case, set html flag to fallback to parsing raw pages
  // TODO: parse csv instead of html, as csv is 5kb vs 17
  if html {
    return harvestFromPage(code)
  } else {
    return harvestFromJSON(code, since, version)
  }
}

func harvestFromPage(code string) ([]core.Measurement, error) {
  // http://www2.nve.no/h/hd/plotreal/Q/0213.00004.000/index.html
  parts := strings.Split(code, ".")
  url := fmt.Sprintf("http://www2.nve.no/h/hd/plotreal/Q/%04v.%05v.000/index.html", parts[0], parts[1])
  resp, err := http.Get(url)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  bytes, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    return nil, err
  }
  page := parsePage(string(bytes))
  m := core.Measurement{
    GaugeId: core.GaugeId{
      Code:   code,
    },
    Timestamp: core.HTime{Time: page.timestamp.Time.UTC()},
    Flow:      page.value,
  }
  return []core.Measurement{m}, nil
}

func harvestFromJSON(code string, since int64, version string) ([]core.Measurement, error) {
  now := time.Now()
  url := "http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time="
  // It seems that this endpoint cannot filter by hours, only by days
  // So "since" parameter has daily granularity.
  // E.g. if you want to filter values from 15:00 yesterday, you will still got all values from today and yesterday
  // If you want to filter values from 13:00 today, you will still get values from 06:00 today, but none from yesterday
  // I keep it here annway
  var sinceStr string
  if since == 0 {
    sinceStr = "-1;0"
  } else {
    sinceT := time.Unix(since, 0)
    sinceStr = sinceT.UTC().Format("20060102T1504") + ";0"
  }
  paddedCode := code + ".0.1001." + version
  url += sinceStr
  url += "&lang=no&chd=ds=htsr,da=29,id=" + paddedCode + ",rt=0"

  r := rand.New(rand.NewSource(now.Unix()))
  url += fmt.Sprintf("&nocache=%d", r.Int31n(1000))

  resp, err := http.Get(url)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()

  bytes, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    return nil, err
  }
  measurements, err := parseRawJSON(code, bytes)
  if err != nil {
    return nil, err
  }

  return measurements, nil
}

func gaugePageWorker(gauges <-chan listItem, results chan<- core.GaugeInfo) {
  for gauge := range gauges {
    resp, err := http.Get(gauge.href)
    result := core.GaugeInfo{
      GaugeId: core.GaugeId{
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
