package galicia2

import (
  "bufio"
  "core"
  "fmt"
  "html"
  "regexp"
  "strconv"
  "strings"
  "time"
)

func (w *workerGalicia2) parseTable() ([]core.GaugeInfo, error) {
  var result []core.GaugeInfo
  core.Client.EnsureCookie("http://saih.chminosil.es", "http://saih.chminosil.es", false)
  resp, err := core.Client.Get("http://saih.chminosil.es/index.php?url=/datos/resumen_excel")
  if err != nil {
    return result, err
  }
  defer resp.Body.Close()
  core.Client.SaveCookies()

  scanner := bufio.NewScanner(resp.Body)
  scanner.Split(splitColumns)

  location, err := time.LoadLocation("CET")
  if err != nil {
    return result, err
  }

  ind := 0
  var row core.GaugeInfo
  stationExp := regexp.MustCompile(`([A-Z]\d{3})\s-\s(.*)`)
  header := true
  for scanner.Scan() {
    if header {
      if ind == 6 {
        header = false
        ind = 0
      } else {
        ind++
      }
      continue
    }
    // There are 7 columns in a row
    switch ind {
    case 0:
      row = core.GaugeInfo{LevelUnit: "m"}
    case 1: // River name and code
      station := scanner.Text()
      parts := stationExp.FindStringSubmatch(station)
      row.GaugeId.Script = w.ScriptName()
      row.GaugeId.Code = parts[1]
      row.Name = prettyName(parts[2])
      row.Url = fmt.Sprintf("http://saih.chminosil.es/index.php?url=/datos/ficha/estacion:%s", parts[1])
    case 5: // Level
      levelStr := scanner.Text()
      levelStr = strings.Replace(levelStr, ",", ".", 1)
      row.Measurement.GaugeId = row.GaugeId
      row.Measurement.Level, _ = strconv.ParseFloat(levelStr, 64)
    case 6: // timestamp
      t, _ := time.ParseInLocation("02/01/2006 15:04", scanner.Text(), location)
      row.Measurement.Timestamp = core.HTime{t.UTC()}
      result = append(result, row)
    }
    ind = (ind + 1) % 7
  }
  if err := scanner.Err(); err != nil {
    return result, err
  }
  return result, nil
}

func prettyName(name string) string {
  words := strings.Fields(html.UnescapeString(name))
  for i, word := range words {
    if word == "DE" || word == "EN" {
      words[i] = strings.ToLower(word)
    } else {
      words[i] = word[:1] + strings.ToLower(word[1:])
    }
  }
  return strings.Join(words, " ")
}
