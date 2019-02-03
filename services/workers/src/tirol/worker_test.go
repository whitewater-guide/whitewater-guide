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
    assert.True(len(infos) > 0, "should return some gauges")
  }
}

func TestHarvest(t *testing.T) {
  worker := NewWorkerTirol()
  assert := assert.New(t)

  msmnts, err := worker.Harvest(core.HarvestOptions{})
  if assert.NoError(err) {
    assert.True(len(msmnts) > 0, "should return some measurements")
  }
}
