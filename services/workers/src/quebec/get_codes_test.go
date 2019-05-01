package quebec

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetCodes(t *testing.T) {
	assert := assert.New(t)
	actual, err := getCodes()
	if assert.NoError(err) {
		assert.Contains(actual, "000091")
	}
}
