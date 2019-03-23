package cantabria

import (
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestParseTable(t *testing.T) {
  assert := assert.New(t)
  gauges, err := parseTable("cantabria")
  if assert.NoError(err) {
    assert.NotEqual(len(gauges), 0)
  }
}