package sepa

import (
  "core"
  "encoding/csv"
  "fmt"
  "github.com/pebbe/go-proj-4/proj"
  "io"
  "math"
  "strconv"
)

const CSV_URL = "http://apps.sepa.org.uk/database/riverlevels/SEPA_River_Levels_Web.csv"

type csvRaw struct {
  sepaHydrologyOffice   string
  stationName           string
  locationCode          string
  nationalGridReference string
  catchmentName         string
  riverName             string
  gaugeDatum            string
  catchmentArea         string
  startDate             string
  endDate               string
  systemId              string
  lowestValue           string
  low                   string
  maxValue              string
  high                  string
  maxDisplay            string
  mean                  string
  units                 string
  webMessage            string
  nrfaLink              string
}

func parseRawCsv() ([]csvRaw, error) {
  resp, err := core.Client.Get(CSV_URL)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  reader := csv.NewReader(resp.Body)
  reader.Comma = ','
  var result []csvRaw
  parsedHeader := false
  for {
    line, err := reader.Read()
    if err == io.EOF {
      break
    } else if err != nil {
      return nil, err
    }
    if len(line) != 20 {
      return nil, fmt.Errorf("unexpected csv format with %d rows insteas of 20", len(line))
    }
    if !parsedHeader {
      parsedHeader = true
      continue
    }

    result = append(result, csvRaw{
      sepaHydrologyOffice: line[0],
      stationName: line[1],
      locationCode: line[2],
      nationalGridReference: line[3],
      catchmentName: line[4],
      riverName: line[5],
      gaugeDatum: line[6],
      catchmentArea: line[7],
      startDate: line[8],
      endDate: line[9],
      systemId: line[10],
      lowestValue: line[11],
      low: line[12],
      maxValue: line[13],
      high: line[14],
      maxDisplay: line[15],
      mean: line[16],
      units: line[17],
      webMessage: line[18],
      nrfaLink: line[19],
    })
  }
  return result, nil
}

func getGaugeInfo(raw csvRaw, script string) (result core.GaugeInfo, err error) {
  ref, err := parseGridRef(raw.nationalGridReference)
  //if err != nil {
  //  return
  //}
  // https://epsg.io/27700
  epsg27700, err := proj.NewProj("+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs")
  defer epsg27700.Close()
  if err != nil {
    return
  }

  epsg4326, err := proj.NewProj("+proj=longlat +datum=WGS84 +no_defs")
  defer epsg4326.Close()
  if err != nil {
    return
  }

  x, y, err := proj.Transform2(epsg27700, epsg4326, float64(ref.easting), float64(ref.northing))
  if err != nil {
    return
  }
  alt, err := strconv.ParseFloat(raw.gaugeDatum, 64)
  if err != nil {
    return
  }
  result = core.GaugeInfo{
    GaugeId: core.GaugeId{
      Code:   raw.locationCode,
      Script: script,
    },
    Name:      fmt.Sprintf("%s - %s", raw.riverName, raw.stationName),
    Url:       "http://apps.sepa.org.uk/waterlevels/default.aspx?sd=t&lc=" + raw.locationCode,
    LevelUnit: raw.units, // all the data is supposed to be in m
    FlowUnit:  "",

    // round to 6 digits after .
    Location: core.Location{
      Longitude: float64(math.Round(proj.RadToDeg(x) * 1000000)) / 1000000,
      Latitude:  float64(math.Round(proj.RadToDeg(y) * 1000000)) / 1000000,
      Altitude:  float64(math.Round(alt * 1000000)) / 1000000,
    },
  }
  return
}

func parseList(script string) (result []core.GaugeInfo, err error) {
  raws, err := parseRawCsv()
  if err != nil {
    return
  }
  result = make([]core.GaugeInfo, len(raws))
  for i, v := range raws {
    info, e := getGaugeInfo(v, script)
    if e != nil {
      return nil, e
    }
    result[i] = info
  }
  return
}
