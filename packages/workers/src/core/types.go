package core

import (
  "time"
  "encoding/json"
  "github.com/spf13/pflag"
)

const (
  AllAtOnce = "allAtOnce"
  OneByOne  = "oneByOne"
)

type Location struct {
  Latitude  float64 `json:"latitude"`
  Longitude float64 `json:"longitude"`
  Altitude  float64 `json:"altitude"`
}

type GaugeId struct {
  Script string `json:"script"`
  Code   string `json:"code"`
}

type GaugeInfo struct {
  GaugeId
  Name      string   `json:"name"`
  Url       string   `json:"url"`
  LevelUnit string   `json:"levelUnit"`
  FlowUnit  string   `json:"flowUnit"`
  Location  Location `json:"location"`
  Measurement
}

type HTime struct {
  time.Time
}

func (t HTime) MarshalJSON() ([]byte, error) {
  return json.Marshal(t.UTC().Format("2006-01-02T15:04Z"))
}

type Measurement struct {
  GaugeId
  Timestamp HTime   `json:"timestamp"`
  Level     float64 `json:"level"`
  Flow      float64 `json:"flow"`
}

type Description struct {
  Name string `json:"name"`
  Mode string `json:"mode"`
}

type HarvestOptions struct {
  Code   string                 `json:"code" structs:"code,omitempty"`
  Since  int64                  `json:"since" structs:"since,omitempty"`
  Extras map[string]interface{} `json:"extras" structs:"extras,omitempty"`
}

type Worker interface {
  ScriptName() string
  HarvestMode() string
  Autofill() ([]GaugeInfo, error)
  Harvest(options HarvestOptions) ([]Measurement, error)
  FlagsToExtras(flags *pflag.FlagSet) map[string]interface{}
}

type Response struct {
  Success bool        `json:"success"`
  Error   string      `json:"error,omitempty"`
  Data    interface{} `json:"data,omitempty"`
}

type WorkerFactory func() Worker
