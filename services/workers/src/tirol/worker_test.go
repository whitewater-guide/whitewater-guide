package tirol

import (
  "core"
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestAutofill(t *testing.T) {
  worker := NewWorkerTirol()
  assert := assert.New(t)

  infos, err := worker.Autofill()
  if assert.NoError(err) {
    if assert.True(len(infos) > 0, "should return some gauges") {
      for _, info := range infos {
        assert.NotEqual(info.GaugeId.Code, "Stationsnummer")
      }
    }
  }
}

func TestHarvest(t *testing.T) {
  worker := NewWorkerTirol()
  assert := assert.New(t)

  msmnts, err := worker.Harvest(core.HarvestOptions{})
  if assert.NoError(err) {
    assert.True(len(msmnts) > 0, "should return some measurements")
    for _, m := range msmnts {
      assert.NotEqual(m.Level, -777.0, "should not return broken gauge values")
    }
  }
}
