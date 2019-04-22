package sepa

import (
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestParseMeasurements(t *testing.T) {
  assert := assert.New(t)
  _, err := parseMeasurements("15018", "sepa")
  assert.NoError(err)
}
