package switzerland

import (
  "github.com/stretchr/testify/assert"
  "testing"
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

func TestParseXML(t *testing.T) {
  assert := assert.New(t)
  result, err := parseXML("switzerland")
  if assert.NoError(err) {
    assert.True(len(result) > 0, "should return some gauges")
  }
}
