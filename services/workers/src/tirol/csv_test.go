package tirol

import (
  "github.com/stretchr/testify/assert"
  "testing"
  "time"
)

func TestRawCSV(t *testing.T) {
  assert := assert.New(t)
  raws, err := parseRawCsv()
  if assert.NoError(err) {
    assert.NotEmpty(raws)
    assert.Equal(
      raws[0].river,
      "Gewässer",
      "encoding failure, expected 'Gewässer', got '%s'",
      raws[0].river,
    )
  }
}

func TestCSCStats(t *testing.T) {
  stats := getStats()
  if len(stats.projections) != 1 {
    t.Errorf("expected data to be only in EPSG:31257, but got %p", stats.projections)
  }
  if len(stats.units) != 1 {
    t.Errorf("expected data to be only in cm, but got %p", stats.units)
  }
}

func TestGetGaugeInfo(t *testing.T) {
  assert := assert.New(t)
  raw := csvRaw{
    name:      "Steeg",
    code:      "201012",
    river:     "Lech",
    parameter: "W.RADAR",
    timestamp: "2019-02-01T16:30:00+0100",
    value:     "215.5",
    unit:      "cm",
    elevation: "1109.3",
    easting:   "147008.0",
    northing:  "233674.0",
    epsg:      "EPSG:31257",
  }
  info, err := getGaugeInfo(raw, "tirol")

  if assert.NoError(err) {
    assert.Equal(info.GaugeId.Script, "tirol")
    assert.Equal(info.GaugeId.Code, "201012")
    assert.Equal(info.Name, "Lech / Steeg")
    assert.Equal(info.LevelUnit, "cm")
    assert.InDelta(info.Location.Longitude, 10.2935031171791, 0.000001)
    assert.InDelta(info.Location.Latitude, 47.2419200352458, 0.000001)
    assert.InDelta(info.Location.Altitude, 1109.3, 0.000001)
  }
}

func TestGetMeasurement(t *testing.T) {
  assert := assert.New(t)
  raw := csvRaw{
    name:      "Steeg",
    code:      "201012",
    river:     "Lech",
    parameter: "W.RADAR",
    timestamp: "2019-02-01T16:30:00+0100",
    value:     "215.5",
    unit:      "cm",
    elevation: "1109.3",
    easting:   "147008.0",
    northing:  "233674.0",
    epsg:      "EPSG:31257",
  }
  loc, err := time.LoadLocation("Europe/Vienna")
  if err != nil {
    t.Errorf("Failed to load time zone: %s", err)
    return
  }
  m, err := getMeasurement(raw, "tirol")

  if assert.NoError(err) {
    assert.Equal(m.GaugeId.Script, "tirol")
    assert.Equal(m.GaugeId.Code, "201012")
    assert.Equal(m.Level, 215.5)
    assert.True(time.Date(2019, time.February, 1, 16, 30, 0, 0, loc).Equal(m.Timestamp.Time))
  }
}
