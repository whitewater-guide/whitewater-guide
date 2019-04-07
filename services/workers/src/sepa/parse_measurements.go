package sepa

import (
  "core"
  "encoding/csv"
  "fmt"
  "io"
  "strconv"
  "time"
)

func parseMeasurements(code, script string) ([]core.Measurement, error) {
  resp, err := core.Client.Get("http://apps.sepa.org.uk/database/riverlevels/" + code + "-SG.csv")
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  reader := csv.NewReader(resp.Body)
  reader.Comma = ','
  var result []core.Measurement

  for {
    line, err := reader.Read()
    if err == io.EOF {
      break
    } else if err != nil {
      return nil, err
    }
    if len(line) != 2 {
      return nil, fmt.Errorf("unexpected csv format with %d rows insteas of 2", len(line))
    }

    timestamp, err := time.Parse("02/01/2006 15:04:05", line[0])
    if err != nil {
      continue
    }

    value, err := strconv.ParseFloat(line[1], 64)
    if err != nil {
      continue
    }
    result = append(result, core.Measurement{
      GaugeId: core.GaugeId{
        Code: code,
        Script: script,
      },
      Timestamp: core.HTime{Time: timestamp},
      Level: value,
    })
  }
  return result, nil
}
