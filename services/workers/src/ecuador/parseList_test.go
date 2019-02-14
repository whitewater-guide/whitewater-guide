package ecuador

import (
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestParseList(t *testing.T)  {
  assert := assert.New(t)
  gauges, err := parseList("ecuador")
  if assert.NoError(err) {
    assert.True(len(gauges) > 0)
  }
}
