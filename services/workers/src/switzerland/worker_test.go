package switzerland

import (
  "core"
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestAutofill(t *testing.T) {
  worker := NewWorkerSwitzerland()
  assert := assert.New(t)

  infos, err := worker.Autofill()
  if assert.NoError(err) {
    assert.True(len(infos) > 0, "should return some gauges")
    //if assert.True(len(infos) > 0, "should return some gauges") {
    //  for _, info := range infos {
    //    assert.NotEqual(info.Location.Altitude, 0.0, "expected gauge %s to have altitude, but got zero", info.GaugeId.Code)
    //  }
    //}
  }
}

func TestHarvest(t *testing.T) {
  worker := NewWorkerSwitzerland()
  assert := assert.New(t)

  msmnts, err := worker.Harvest(core.HarvestOptions{})
  if assert.NoError(err) {
    assert.True(len(msmnts) > 0, "should return some measurements")
  }
}
