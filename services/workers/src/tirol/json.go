package tirol

import (
  "core"
  "encoding/json"
  "fmt"
  "strconv"
  "time"
)

// this is legacy url, harvest not permitted
const dataURL = "https://apps.tirol.gv.at/hydro/stationdata/data.json"

type GTime struct {
  time.Time
}

func (self *GTime) UnmarshalJSON(b []byte) (err error) {
  i, err := strconv.ParseFloat(string(b), 64)
  if err != nil {
    return
  }
  t := time.Unix(int64(i), 0)
  self.Time = t.UTC()
  return
}

type Gauge struct {
  Values    Values  `json:"values"`
  Name      string  `json:"name"`
  WtoObject string  `json:"WTO_OBJECT"`
  Code      string  `json:"number"`
  Longitude float64 `json:"longitude,string"`
  Latitude  float64 `json:"latitude,string"`
  Altitude  float64 `json:"altitude,string"`
}

type Values struct {
  Flows  ValueL1 `json:"W"`
  Levels ValueL1 `json:"Q"`
}

type ValueL1 struct {
  Value ValueL2 `json:"15m.Cmd.HD"`
}

type ValueL2 struct {
  Value     float64 `json:"v"`
  Timestamp GTime   `json:"dt"`
  Unit      string  `json:"unit"`
}

func parseJson(script string) (result []core.GaugeInfo, err error) {
  resp, err := core.Client.Get(dataURL)

  if err != nil {
    return
  }
  defer resp.Body.Close()
  gauges := make([]Gauge, 0)
  err = json.NewDecoder(resp.Body).Decode(&gauges)
  if err != nil {
    return nil, err
  }

  for _, gauge := range gauges {
    if gauge.Values.Flows.Value.Value == 0 && gauge.Values.Levels.Value.Value == 0 {
      continue
    }
    flowUnit := "m3/s"
    if gauge.Values.Flows.Value.Unit != "" {
      flowUnit = gauge.Values.Flows.Value.Unit
    }
    levelUnit := "cm"
    if gauge.Values.Levels.Value.Unit != "" {
      levelUnit = gauge.Values.Levels.Value.Unit
    }
    info := core.GaugeInfo{
      GaugeId: core.GaugeId{
        Script: script,
        Code:   gauge.Code,
      },
      Name: fmt.Sprintf("%s / %s", gauge.WtoObject, gauge.Name),
      Location: core.Location{
        Latitude:  gauge.Latitude,
        Longitude: gauge.Longitude,
        Altitude:  gauge.Altitude,
      },
      FlowUnit:  flowUnit,
      LevelUnit: levelUnit,
      Url:       "https://apps.tirol.gv.at/hydro/#/Wasserstand/?station=" + gauge.Code,
      Measurement: core.Measurement{
        GaugeId: core.GaugeId{
          Script: script,
          Code:   gauge.Code,
        },
        Flow:      gauge.Values.Flows.Value.Value,
        Level:     gauge.Values.Levels.Value.Value,
        Timestamp: core.HTime{gauge.Values.Levels.Value.Timestamp.Time},
      },
    }
    result = append(result, info)
  }

  return result, nil
}
