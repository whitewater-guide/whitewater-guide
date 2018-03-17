package core

import (
  "fmt"
  "math/rand"
  "time"
)

func unixHTime(sec int64) HTime {
  return HTime{time.Unix(sec, 0)}
}

func GenerateRandGauge(script string, index int) GaugeInfo {
  src := rand.NewSource(time.Now().UnixNano())
  r := rand.New(src)
  return GaugeInfo{
    GaugeId: GaugeId{
      Script: script,
      Code:   fmt.Sprintf("g%03d", index),
    },
    Name:      fmt.Sprintf("Test gauge #%d", index),
    Url:       fmt.Sprintf("http://whitewater.guide/gauges/%d", index),
    LevelUnit: "m",
    FlowUnit:  "m3/s",
    Location: Location{
      Longitude: r.Float64()*360.0 - 180.0,
      Latitude:  r.Float64()*180.0 - 90.0,
      Altitude:  r.Float64() * 3000.0,
    },
  }
}

func GenerateRandMeasurement(script string, code string, value float64, min float64, max float64) Measurement {
  src := rand.NewSource(time.Now().UnixNano())
  r := rand.New(src)
  level, flow := value, value
  if value == 0.0 {
    delta := max - min
    if delta == 0 {
      delta = 100
    } else if delta < 0 {
      delta = -delta
    }
    level = min + r.Float64()*delta
    flow = min + r.Float64()*delta
  }

  return Measurement{
    GaugeId: GaugeId{
      Script: script,
      Code:   code,
    },
    Timestamp: HTime{time.Now().UTC()},
    Level:     level,
    Flow:      flow,
  }
}
