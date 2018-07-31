package riverzone

import (
  "core"
  "encoding/json"
  "fmt"
  "github.com/spf13/pflag"
  "net/http"
  "os"
)

type workerRiverzone struct{}

func (w *workerRiverzone) ScriptName() string {
  return "riverzone"
}

func (w *workerRiverzone) HarvestMode() string {
  return core.AllAtOnce
}

func (w *workerRiverzone) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
  return nil
}

func fetchStations() (*Stations, error) {
  req, _ := http.NewRequest("GET", "https://api.riverzone.eu/v1/stations", nil)
  req.Header.Set("User-Agent", core.UserAgent)
  req.Header.Set("Cache-Control", "no-cache")
  req.Header.Set("X-Key", os.Getenv("RIVERZONE_KEY"))
  resp, err := core.Client.Do(req)

  // Hardcoded example
  // resp, err := http.Get("https://gist.githubusercontent.com/doomsower/bd8d6152828acfd19cf7a627065d96ca/raw/0d1f36dd6a19dd8cd15af2c3c46e95b8112dfacb/reverzone.json")

  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  response := &Stations{}
  err = json.NewDecoder(resp.Body).Decode(response)
  if err != nil {
    return nil, err
  }
  return response, nil
}

func (w *workerRiverzone) Autofill() ([]core.GaugeInfo, error) {
  stations, err := fetchStations()
  if err != nil {
    return nil, err
  }
  var result []core.GaugeInfo

  for _, station := range stations.Stations {
    if !station.Enabled {
      continue
    }
    var flowUnit, levelUnit string
    if station.Readings.Cm != nil {
      levelUnit = "cm"
    }
    if station.Readings.M3s != nil {
      flowUnit = "m3s"
    }
    info := core.GaugeInfo{
      GaugeId: core.GaugeId{
        Script: w.ScriptName(),
        Code:   station.Id,
      },
      Name: fmt.Sprintf("%s - %s - %s - %s", station.CountryCode, station.State, station.RiverName, station.StationName),
      Location: core.Location{
        Latitude:  station.Latlng.Lat,
        Longitude: station.Latlng.Lng,
        Altitude:  0,
      },
      FlowUnit:  flowUnit,
      LevelUnit: levelUnit,
      Url:       station.SourceLink,
    }
    result = append(result, info)
  }

  return result, nil
}

func (w *workerRiverzone) Harvest(_ core.HarvestOptions) ([]core.Measurement, error) {
  stations, err := fetchStations()
  if err != nil {
    return nil, err
  }
  var result []core.Measurement
  for _, station := range stations.Stations {
    if !station.Enabled {
      continue
    }

    flowValues := make(map[core.HTime]core.Measurement)
    if station.Readings.M3s != nil {
      for _, reading := range station.Readings.M3s {
        if reading.Value == 0.0 {
          continue
        }
        t := core.HTime{reading.Timestamp.Time}
        flowValues[t] = core.Measurement{
          GaugeId: core.GaugeId{
            Script: w.ScriptName(),
            Code:   station.Id,
          },
          Flow:      reading.Value,
          Timestamp: t,
        }
      }
    }

    if station.Readings.Cm != nil {
      for _, reading := range station.Readings.Cm {
        if reading.Value == 0.0 {
          continue
        }
        t := core.HTime{reading.Timestamp.Time}
        // Trying to find corresponding flow value:
        if flowValue, ok := flowValues[t]; ok {
          flowValue.Level = reading.Value
        } else {
          result = append(result, core.Measurement{
            GaugeId: core.GaugeId{
              Script: w.ScriptName(),
              Code:   station.Id,
            },
            Level:     reading.Value,
            Timestamp: t,
          })
        }
      }
    }

    for _, v := range flowValues {
      result = append(result, v)
    }
  }
  return result, nil
}

func NewWorkerRiverzone() core.Worker {
  return &workerRiverzone{}
}
