package switzerland

import (
  "core"
  "encoding/xml"
  "github.com/stretchr/testify/assert"
  "testing"
  "time"
)

func TestFetchStations(t *testing.T) {
  assert := assert.New(t)
  dataRoot, err := fetchStations()
  if assert.NoError(err) {
    assert.NotEqual(len(dataRoot.Stations), 0)
    for _, station := range dataRoot.Stations {
      var flowCnt, levelCnt int
      var prevTimestamp *SwissTime
      for _, param := range station.Parameters {
        switch param.Type {
        case 10, 22:
          flowCnt += 1
        case 1, 2, 28:
          levelCnt += 1
        }
        if prevTimestamp != nil {
          assert.Equal(*prevTimestamp, param.Datetime, "timestamps should be equal for all parameters")
        }
        prevTimestamp = &param.Datetime
      }
      assert.True(flowCnt <= 1, "At most one flow parameter per station")
      assert.True(levelCnt <= 1, "At most one level parameter per station")
    }
  }
}

func TestGetLocation(t *testing.T) {
  assert := assert.New(t)
  loc, err := getLocation(SwissStation{Easting: 575500, Northing: 197790})
  if assert.NoError(err) {
    assert.InDelta(7.1169195, loc.Longitude, 0.000001)
    assert.InDelta(46.930748, loc.Latitude, 0.000001)
  }
}

func TestStationToGauge(t *testing.T) {
  assert := assert.New(t)
  station := SwissStation{
    XMLName: xml.Name{Local: "station"},
    Code: "2011",
    Name: "Sion",
    WaterBodyName: "Rhône",
    WaterBodyType: "river",
    Easting: 593770,
    Northing: 118630,
    Parameters: []SwissParameter{
      SwissParameter{
        XMLName: xml.Name{Local: "parameter"},
        Name: "Temperatur",
        Unit: "°C",
        Type: 3,
        Variant: 20,
        Datetime: SwissTime{time.Date(2019, time.February, 9, 12, 0, 0, 0, time.UTC)},
        Value: 4.2,
      },
      SwissParameter{
        XMLName: xml.Name{Local: "parameter"},
        Name: "Abfluss m3/s",
        Unit: "m3/s",
        Type: 10,
        Variant: 11,
        Datetime: SwissTime{time.Date(2019, time.February, 9, 21, 40, 0, 0, time.UTC)},
        Value: 27,
      },
      SwissParameter{
        XMLName: xml.Name{Local: "parameter"},
        Name: "Pegel m ü. M.",
        Unit: "m ü. M.",
        Type: 2,
        Variant: 1,
        Datetime: SwissTime{time.Date(2019, time.February, 9, 21, 40, 0, 0, time.UTC)},
        Value: 482.60,
      },
    },
  }
  expected := core.GaugeInfo{
    GaugeId: core.GaugeId{
      Code: "2011",
      Script: "switzerland",
    },
    Name: "Rhône - Sion",
    Url: "https://www.hydrodaten.admin.ch/en/2011.html",
    LevelUnit: "m ü. M.",
    FlowUnit: "m3/s",
    Location: core.Location{
      Longitude: 7.35790839981199,
      Latitude: 46.21908857699619,
    },
    Measurement: core.Measurement{
      GaugeId: core.GaugeId{
        Code: "2011",
        Script: "switzerland",
      },
      Level: 482.60,
      Flow: 27,
      Timestamp: core.HTime{Time: time.Date(2019, time.February, 9, 21, 40, 0, 0, time.UTC)},
    },
  }
  actual, err := stationToGauge(&station, "switzerland")
  if assert.NoError(err) {
    assert.Equal(expected, *actual)
  }
}

func TestParseXML(t *testing.T) {
  assert := assert.New(t)
  result, err := parseXML("switzerland")
  if assert.NoError(err) {
    if assert.True(len(result) > 0, "should return some gauges") {
      for _, v := range result {
        assert.True(v.LevelUnit != "" || v.FlowUnit != "", "gauge %s has neihter flow nor level", v.Code)
      }
    }
  }
}
