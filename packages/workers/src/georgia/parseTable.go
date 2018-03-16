package georgia

import (
  "github.com/PuerkitoBio/goquery"
  "core"
  "net/http"
  "fmt"
  "strings"
  "regexp"
  "crypto/md5"
  "time"
  "strconv"
)

const url = "http://meteo.gov.ge/index.php?l=2&pg=hd"

func (w *workerGeorgia) parseTable() ([]core.GaugeInfo, error) {
  resp, err := http.Get(url)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  doc, err := goquery.NewDocumentFromReader(resp.Body)
  if err != nil {
    return nil, err
  }
  nameRegex := regexp.MustCompile("\\W")
  var result []core.GaugeInfo
  doc.Find("td[background='images/hidro1.gif']").Each(func(i int, elem *goquery.Selection) {
    table := elem.ParentsFiltered("table").First()
    name := strings.TrimSpace(table.Find("b").First().Text())
    levelStr := strings.TrimSpace(table.Find(".date2").First().Text())
    level, _ := strconv.ParseFloat(levelStr, 64)
    code := nameRegex.ReplaceAllString(name, "")
    code = strings.ToLower(code)
    code = fmt.Sprintf("%x", md5.Sum([]byte(code)))
    result = append(result, core.GaugeInfo{
      GaugeId: core.GaugeId{
        Script: w.ScriptName(),
        Code:   code,
      },
      LevelUnit: "cm",
      Name:      name,
      Url:       url,
      Measurement: core.Measurement{
        GaugeId: core.GaugeId{
          Script: w.ScriptName(),
          Code:   code,
        },
        Timestamp: core.HTime{time.Now().UTC()},
        Level:     level,
      },
    })
  })
  return result, nil
}
