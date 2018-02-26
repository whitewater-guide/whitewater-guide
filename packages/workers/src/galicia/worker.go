package main

import (
  "github.com/doomsower/whitewater/workers/core"
  "encoding/json"
  "fmt"
  "net/http"
  "github.com/spf13/pflag"
)

type worker struct {
  core.NamedWorker
}

func (w *worker) Autofill() ([]core.GaugeInfo, error) {
  resp, err := http.Get("http://servizos.meteogalicia.es/rss/observacion/jsonAforos.action")
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  rawData := &Raw{}
  err = json.NewDecoder(resp.Body).Decode(rawData)
  if err != nil {
    return nil, err
  }

  result := make([]core.GaugeInfo, len(rawData.ListaAforos))

  for i, entry := range rawData.ListaAforos {
    var flowValue, levelValue float64
    flowUnit, levelUnit := "m3s", "m"
    for _, medida := range entry.ListaMedidas {
      switch medida.CodParametro {
      case 1:
        levelUnit = medida.Unidade
        levelValue = medida.Valor
      case 4:
        flowUnit = medida.Unidade
        flowValue = medida.Valor
      }
    }
    info := core.GaugeInfo{
      GaugeId: core.GaugeId{
        Code: fmt.Sprintf("%d", entry.Ide),
      },
      Name: entry.NomeEstacion,
      Location: core.Location{
        Latitude:  entry.Latitude,
        Longitude: entry.Lonxitude,
        Altitude:  0,
      },
      FlowUnit:  flowUnit,
      LevelUnit: levelUnit,
      Measurement: core.Measurement{
        GaugeId: core.GaugeId{
          Code: fmt.Sprintf("%d", entry.Ide),
        },
        Flow:      flowValue,
        Level:     levelValue,
        Timestamp: core.HTime{entry.DataUTC.Time},
      },
      Url: "http://www2.meteogalicia.gal/servizos/AugasdeGalicia/estacionsinfo.asp?Nest=" + fmt.Sprintf("%d", entry.Ide),
    }
    result[i] = info
  }
  return result, nil
}

func (w *worker) Harvest(_ string, _ int64, _ *pflag.FlagSet) ([]core.Measurement, error) {
  infos, err := w.Autofill()
  if err != nil {
    return nil, err
  }
  result := make([]core.Measurement, len(infos))
  for i, info := range infos {
    result[i] = info.Measurement
  }
  return result, nil
}

func (w *worker) HarvestMode() string {
  return core.AllAtOnce
}
