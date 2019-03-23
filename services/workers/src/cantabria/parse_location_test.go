package cantabria

import (
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestParseLocation(t *testing.T) {
  assert := assert.New(t)
  lat, lng := parseGaugeLocation("A047")
  assert.Equal(43.17956622852151, lat)
  assert.Equal(-7.199219878095757, lng)
}
