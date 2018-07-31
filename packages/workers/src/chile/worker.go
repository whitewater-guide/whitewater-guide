package chile

import (
  "core"
  "github.com/spf13/pflag"
  "fmt"
  "strings"
  "github.com/paulmach/orb/project"
  "github.com/paulmach/orb"
)

type workerChile struct{}

func (w *workerChile) ScriptName() string {
  return "chile"
}

func (w *workerChile) HarvestMode() string {
  return core.OneByOne
}

func (w *workerChile) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
  return nil
}

func (w *workerChile) Autofill() ([]core.GaugeInfo, error) {
  webmap, err := parseWebmap()
  if err != nil {
    return nil, err
  }

  listedGauges, err := getListedGauges()
  if err != nil {
    return nil, err
  }
  gaugeIds := make([]string, 0)
  for k := range listedGauges {
    gaugeIds = append(gaugeIds, k)
  }

  numGauges := len(gaugeIds)
  worthiness := make(map[string]bool)
  for i := 0; i < numGauges; i += 3 {
    //fmt.Println("Checking", i+3, numGauges)
    checkGaugesWorthiness(gaugeIds[i:i+3], worthiness)
    //if err != nil {
    //  fmt.Println(err)
    //}
  }

  var result []core.GaugeInfo

  for id, worthy := range worthiness {
    if worthy == false {
      continue
    }
    if feature, ok := webmap[id]; ok {
      wgs84 := project.Mercator.ToWGS84(orb.Point{feature.Geometry.X, feature.Geometry.Y})
      result = append(result, core.GaugeInfo{
        GaugeId: core.GaugeId{
          Script: w.ScriptName(),
          Code:   id,
        },
        Name:      strings.Title(strings.ToLower(feature.Attributes.Name)),
        FlowUnit:  "m3/s",
        LevelUnit: "m",
        Location: core.Location{
          Longitude: wgs84.Lon(),
          Latitude:  wgs84.Lat(),
        },
      })
    } else {
      // gauge is not present on webmap, so we cannot get it's Location and nice name
      result = append(result, core.GaugeInfo{
        GaugeId: core.GaugeId{
          Script: w.ScriptName(),
          Code:   id,
        },
        Name:      listedGauges[id],
        FlowUnit:  "m3/s",
        LevelUnit: "m",
      })
    }
  }

  return result, nil
}

func (w *workerChile) Harvest(opts core.HarvestOptions) ([]core.Measurement, error) {
  if opts.Code == "" {
    return nil, fmt.Errorf("gauge code is required")
  }
  rawDoc, err := loadXLS(opts.Code, opts.Since)
  if err != nil {
    return nil, err
  }
  result, err := parseXLS(rawDoc, w.ScriptName(), opts.Code)
  return result, err
}

func NewWorkerChile() core.Worker {
  return &workerChile{}
}
