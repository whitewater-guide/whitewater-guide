package norway

import (
  "github.com/PuerkitoBio/goquery"
  "strings"
  "strconv"
  "encoding/json"
  "time"
  "core"
)

type listItem struct {
  name     string
  href     string
  id       string
  altitude float64
}

type gaugePage struct {
  latitude  float64
  longitude float64
  timestamp NTime
  value     float64
}

type RawJSON []struct {
  SeriesPoints []struct {
    Key   NTime
    Value float64
  }
}

type NTime struct {
  time.Time
}

func (self *NTime) UnmarshalJSON(b []byte) (err error) {
  // This look like "/Date(1519056000000)/" (with quotes)
  // This is in nanoseconds, so cut last 3 zeroes
  s := b[8: len(b)-7 ]
  i, err := strconv.ParseInt(string(s), 10, 64)
  t := time.Unix(i, 0)
  self.Time = t
  return
}

func parseList(doc goquery.Document) []listItem {
  var result []listItem
  table := doc.Find("table").First()
  table.Find("tr").Slice(1, goquery.ToEnd).Each(func(i int, tr *goquery.Selection) {
    cols := tr.Find("td")
    altStr := cols.Eq(2).Text()
    altStr = strings.TrimSpace(altStr)
    altStr = strings.Replace(altStr, "m", "", 1)
    altitude, _ := strconv.ParseFloat(altStr, 64)
    result = append(result, listItem{
      name:     cols.Eq(0).Text(),
      href:     urlBase + cols.Eq(0).Find("a").First().AttrOr("href", ""),
      id:       cols.Eq(1).Text(),
      altitude: altitude,
    })
  })
  return result
}

func parsePage(data string) gaugePage {
  var result gaugePage
  // Find lastTimestamp and value (flow)
  // <center>Siste m�ling, tid=20.02.2018 06:00, verdi=  2.619</center><br>
  tsInd := strings.Index(data, "tid=")
  if tsInd >= 0 {
    data = string(data[tsInd+len("tid="):])
    tsEnd := strings.Index(data, ",")
    tsStr := string(data[:tsEnd])
    ts, _ := time.Parse("02.01.2006 15:04", tsStr)
    result.timestamp = NTime{ts.UTC()}

    valInd := strings.Index(data, "verdi=")
    data = string(data[valInd+len("verdi="):])
    valEnd := strings.Index(data, "<")
    valStr := string(data[:valEnd])
    result.value, _ = strconv.ParseFloat(strings.TrimSpace(valStr), 64)
  }

  // Breddegrad = latitude Lengdegrad = longitude
  lngInd := strings.Index(data, "Lengdegrad: <B>")
  if lngInd >= 0 {
    data = string(data[lngInd+len("Lengdegrad: <B>"):])
    lngEnd := strings.Index(data, "<")
    lngStr := string(data[:lngEnd])
    result.longitude, _ = strconv.ParseFloat(strings.TrimSpace(lngStr), 64)

    latInd := strings.Index(data, "Breddegrad: <B>")
    data = string(data[latInd+len("Breddegrad: <B>"):])
    latEnd := strings.Index(data, "<")
    latStr := string(data[:latEnd])
    result.latitude, _ = strconv.ParseFloat(strings.TrimSpace(latStr), 64)
  }

  return result
}

func parseRawJSON(script, code string, b []byte) (measurements []core.Measurement, err error) {
  var res RawJSON
  err = json.Unmarshal(b, &res)
  points := res[0].SeriesPoints
  measurements = make([]core.Measurement, len(points))
  for i, p := range points {
    measurements[i] = core.Measurement{
      GaugeId: core.GaugeId{
        Script: script,
        Code: code,
      },
      Timestamp: core.HTime{p.Key.Time},
      Flow:      p.Value,
    }
  }
  return
}
