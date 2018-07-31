package riverzone

import (
  "time"
  "encoding/json"
  "strconv"
)

type Timestamp struct {
  time.Time
}

func (self *Timestamp) UnmarshalJSON(b []byte) error {
  epoch, err := strconv.ParseInt(string(b), 10, 64)
  if err != nil {
    return err
  }
  t := time.Unix(epoch, 0)
  self.Time = t.UTC()
  return nil
}

type TimestampedValue struct {
  Timestamp Timestamp `json:"ts"`
  Value     float64   `json:"v"`
}

type LatLng struct {
  Lat float64
  Lng float64
}

func (self *LatLng) UnmarshalJSON(b []byte) error {
  var tuple []int
  err := json.Unmarshal(b, &tuple)
  if err != nil {
    return err
  }
  self.Lat = float64(tuple[0]) / 1000000
  self.Lng = float64(tuple[1]) / 1000000
  return nil
}

type Readings struct {
  Cm  []TimestampedValue `json:"cm"`
  M3s []TimestampedValue `json:"m3s"`
}

// https://api.riverzone.eu/?http#station-objects
type Station struct {
  Id            string            `json:"id"`
  Revision      int               `json:"revision"`
  LastUpdatedTs int               `json:"lastUpdatedTs"`
  Enabled       bool              `json:"enabled"`
  RiverName     string            `json:"riverName"`
  StationName   string            `json:"stationName"`
  CountryCode   string            `json:"countryCode"`
  State         string            `json:"state"`
  Latlng        LatLng            `json:"latlng"`
  Source        string            `json:"source"`
  SourceLink    string            `json:"sourceLink"`
  RefreshMins   int               `json:"refreshMins"`
  Notes         map[string]string `json:"notes"`
  Readings      Readings          `json:"readings"`
  ParserConfigs string            `json:"parserConfigs"`
}

// https://api.riverzone.eu/?http#source-object-properties
type Source struct {
  Id             string `json:"id"`
  Name           string `json:"name"`
  LicensingTerms string `json:"licensingTerms"`
  Website        string `json:"website"`
}

// https://api.riverzone.eu/?http#stations-api
type Stations struct {
  ElapsedMs int       `json:"elapsedMs"`
  Stations  []Station `json:"stations"`
  Sources   []Source  `json:"sources"`
}
