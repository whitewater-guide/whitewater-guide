package ecuador

import (
  "core"
  "github.com/stretchr/testify/assert"
  "testing"
  "time"
)

func TestParseMeasurement(t *testing.T)  {
  assert := assert.New(t)
  raw := []interface{}{
    "20190210170000", 0.36, 50.0, 0.33, 50.0, 0.35, 50.0, 0.35, 50.0, 0.0, 50.0, 13.77, 50.0,
  }
  m, err := parseMeasurement(raw, "ecuador", "H0064", 0, 7)
  if assert.NoError(err) {
    assert.Equal(core.Measurement{
      GaugeId: core.GaugeId{
        Script: "ecuador",
        Code: "H0064",
      },
      Timestamp: core.HTime{Time: time.Date(2019, time.February, 10, 17, 0, 0, 0, time.UTC)},
      Level: 0.35,
    }, m)
  }
}

func TestParseGauge(t *testing.T) {
  assert := assert.New(t)
  measurements, err := parseGauge("ecuador", "H0064")
  if assert.NoError(err) {
    if assert.NotEqual(0, len(measurements)) {
      assert.NotEqual(0, measurements[0].Level)
    }
  }
}
