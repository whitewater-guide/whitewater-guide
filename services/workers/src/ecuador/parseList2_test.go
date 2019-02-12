package ecuador

import (
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestParseList2(t *testing.T)  {
  assert := assert.New(t)
  gauges, err := parseList2("ecuador")
  if assert.NoError(err) {
    assert.True(len(gauges) > 0)
  }
}
