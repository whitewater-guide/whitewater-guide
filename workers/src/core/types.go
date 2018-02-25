package core

import (
  "time"
  "encoding/json"
  "github.com/spf13/pflag"
  "os"
  "strings"
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

type ScriptNamer interface {
  ScriptName() string
}

type NamedWorker struct {
  scriptName string
}

func (w *NamedWorker) ScriptName() string {
  if w.scriptName == "" {
    parts := strings.Split(os.Args[0], "/")
    w.scriptName = parts[len(parts)-1]
  }
  return w.scriptName
}

type Worker interface {
  Autofill() ([]GaugeInfo, error)
  Harvest(code string, since int64, flags *pflag.FlagSet) ([]Measurement, error)
  HarvestMode() string
  ScriptNamer
}

type Response struct {
  Success bool        `json:"success"`
  Error   string      `json:"error,omitempty"`
  Data    interface{} `json:"data,omitempty"`
}
