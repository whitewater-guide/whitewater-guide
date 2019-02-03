package tirol

import "C"
import (
  "core"
  "encoding/csv"
  "fmt"
  "github.com/pebbe/go-proj-4/proj"
  "golang.org/x/text/encoding/charmap"
  "golang.org/x/text/transform"
  "io"
  "strconv"
  "time"
)

// Encoding is windows-1252
const CSV_URL = "https://apps.tirol.gv.at/hydro/ogd/OGD_W.csv"

type csvRaw struct {
  name      string // Stationsname;
  code      string // Stationsnummer;
  river     string // Gewässer; - means body of water, not necessary river
  parameter string // Parameter;
  timestamp string // Zeitstempel in ISO8601;
  value     string // Wert;
  unit      string // Einheit;
  elevation string // Seehˆhe;
  easting   string // Rechtswert;
  northing  string // Hochwert;
  epsg      string // EPSG-Code
}

func parseRawCsv() ([]csvRaw, error) {
  resp, err := core.Client.Get(CSV_URL)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  reader := csv.NewReader(transform.NewReader(resp.Body, charmap.Windows1252.NewDecoder()))
  reader.Comma = ';'
  var result []csvRaw
  for {
    line, err := reader.Read()
    if err == io.EOF {
      break
    } else if err != nil {
      return nil, err
    }
    if len(line) != 11 {
      return nil, fmt.Errorf("unexpected csv format with %d rows insteas of 11", len(line))
    }

    result = append(result, csvRaw{
      name:      line[0],
      code:      line[1],
      river:     line[2],
      parameter: line[3],
      timestamp: line[4],
      value:     line[5],
      unit:      line[6],
      elevation: line[7],
      easting:   line[8],
      northing:  line[9],
      epsg:      line[10],
    })
  }
  return result, nil
}

func getGaugeInfo(raw csvRaw, script string) (result core.GaugeInfo, err error) {
  // https://epsg.io/31257.proj4
  epsg31257, err := proj.NewProj("+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=150000 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs")
  defer epsg31257.Close()
  if err != nil {
    return
  }

  epsg4326, err := proj.NewProj("+proj=longlat +datum=WGS84 +no_defs")
  defer epsg4326.Close()
  if err != nil {
    return
  }

  x, _ := strconv.ParseFloat(raw.easting, 64)
  y, _ := strconv.ParseFloat(raw.northing, 64)
  z, _ := strconv.ParseFloat(raw.elevation, 64)

  x, y, err = proj.Transform2(epsg31257, epsg4326, x, y)
  if err != nil {
    return
  }
  result = core.GaugeInfo{
    GaugeId: core.GaugeId{
      Code:   raw.code,
      Script: script,
    },
    Name:      fmt.Sprintf("%s / %s", raw.river, raw.name),
    Url:       "https://apps.tirol.gv.at/hydro/#/Wasserstand/?station=" + raw.code,
    LevelUnit: raw.unit, // all the data is supposed to be in cm
    FlowUnit:  "",

    Location: core.Location{
      Longitude: proj.RadToDeg(x),
      Latitude:  proj.RadToDeg(y),
      Altitude:  z,
    },
  }
  return
}

func getMeasurement(raw csvRaw, script string) (core.Measurement, error) {
  t, err := time.Parse("2006-01-02T15:04:05-0700", raw.timestamp)
  if err != nil {
    return core.Measurement{}, err
  }
  level, err := strconv.ParseFloat(raw.value, 64)
  if err != nil {
    return core.Measurement{}, err
  }
  return core.Measurement{
    GaugeId: core.GaugeId{
      Script: script,
      Code: raw.code,
    },
    Level: level,
    Timestamp: core.HTime{Time: t},
  }, nil
}

// for dev purposes only
type csvStats struct {
  units       map[string]int
  projections map[string]int
}

// for dev purposes only
func getStats() csvStats {
  raws, _ := parseRawCsv()
  result := csvStats{
    units:       make(map[string]int),
    projections: make(map[string]int),
  }
  for _, raw := range raws[1:] {
    unitCnt := result.units[raw.unit]
    result.units[raw.unit] = unitCnt + 1
    projCnt := result.projections[raw.epsg]
    result.projections[raw.epsg] = projCnt + 1
  }
  return result
}
