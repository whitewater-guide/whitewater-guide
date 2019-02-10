package ecuador

import (
  "core"
  "encoding/json"
  "fmt"
  "time"
)

var ECUADOR_TIMEZONE = time.FixedZone("UTC-5", -5*60*60)

func findIndices(response *EcuadorRoot) (int, int, error) {
  dateIndex, valueIndex := -1, -1
  for i, v := range response.Head.Fields {
    if v.Name == "FechaHora" {
      dateIndex = i
      continue
    }
    if v.Name == "nivelSmp" {
      valueIndex = i
      continue
    }
  }
  if dateIndex == -1 {
    return dateIndex, valueIndex, fmt.Errorf("date field not found")
  }
  if valueIndex == -1 {
    return dateIndex, valueIndex, fmt.Errorf("level field not found")
  }
  return dateIndex, valueIndex, nil
}

func parseMeasurement(raw []interface{}, script, code string, dateInd, valueInd int) (core.Measurement, error) {
  if dateInd >= len(raw) {
    return core.Measurement{}, fmt.Errorf("date index is outside of vals range")
  }
  if valueInd >= len(raw) {
    return core.Measurement{}, fmt.Errorf("value index is outside of vals range")
  }

  dateRaw := raw[dateInd]
  valueRaw := raw[valueInd]

  dateStr, ok := dateRaw.(string)
  if !ok {
    return core.Measurement{}, fmt.Errorf("vals element at date index is not a string")
  }
  value, ok := valueRaw.(float64)
  if !ok {
    return core.Measurement{}, fmt.Errorf("vals element at value index is not a float")
  }

  t, err := time.ParseInLocation("20060102150405", dateStr, ECUADOR_TIMEZONE)
  if err != nil {
    return core.Measurement{}, err
  }
  return core.Measurement{
    GaugeId: core.GaugeId{
      Script: script,
      Code: code,
    },
    Level: value,
    Timestamp: core.HTime{Time: t},
  }, nil
}

func parseGauge(script, code string) ([]core.Measurement, error) {
  ts := time.Now().In(ECUADOR_TIMEZONE).UnixNano() / int64(time.Millisecond)
  url := fmt.Sprintf("http://186.42.174.243:9090/?command=DataQuery&uri=%s%%3Ahora1&format=json&mode=most-recent&p1=1&p2=&headsig=0&order=real-time&_=%d", code, ts)
  resp, err := core.Client.Get(url)

  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  response := &EcuadorRoot{}
  err = json.NewDecoder(resp.Body).Decode(response)
  if err != nil {
    return nil, err
  }
  dateInd, valueInd, err := findIndices(response)
  if err != nil {
    return nil, err
  }

  var result []core.Measurement
  for _, rawData := range response.Data {
    m, err := parseMeasurement(rawData.Vals, script, code, dateInd, valueInd)
    if err != nil {
      return nil, err
    }
    result = append(result, m)
  }

  return result, nil
}
