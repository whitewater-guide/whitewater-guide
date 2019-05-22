package quebec

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestConvertDMS(t *testing.T) {
	assert := assert.New(t)
	actual, err := convertDMS("59°51'48\"")
	if assert.NoError(err) {
		assert.InDelta(59.86333333, actual, 0.00000001)
	}
}
