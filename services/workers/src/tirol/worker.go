package tirol

import (
  "core"
  "github.com/spf13/pflag"
)

type workerTirol struct{}

func (w *workerTirol) ScriptName() string {
  return "tirol"
}

func (w *workerTirol) HarvestMode() string {
  return core.AllAtOnce
}

func (w *workerTirol) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
  return nil
}

func (w *workerTirol) Autofill() (result []core.GaugeInfo, err error) {
  raws, err := parseRawCsv()
  if err != nil {
    return
  }
  byCode := make(map[string]core.GaugeInfo)
  for _, raw := range raws[1:] {
    _, ok := byCode[raw.code]
    if ok {
      continue
    }
    info, err := getGaugeInfo(raw, w.ScriptName())
    if err != nil {
      return nil, err
    }
    byCode[raw.code] = info;
  }
  result = make([]core.GaugeInfo, len(byCode))
  i := 0
  for _, v := range byCode {
    result[i] = v
    i++
  }
  return
}

func (w *workerTirol) Harvest(_ core.HarvestOptions) ([]core.Measurement, error) {
  raws, err := parseRawCsv()
  if err != nil {
    return nil, err
  }
  result := make([]core.Measurement, len(raws)-1)
  for i, raw := range raws[1:] {
    m, err := getMeasurement(raw, w.ScriptName())
    if err != nil {
      return nil, err
    }
    result[i] = m
  }
  return result, nil
}

func NewWorkerTirol() core.Worker {
  return &workerTirol{}
}
