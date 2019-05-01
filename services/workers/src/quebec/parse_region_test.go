package quebec

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestFetchRegion(t *testing.T) {
	assert := assert.New(t)
	actual, err := fetchRegion(1)
	if assert.NoError(err) {
		assert.Equal(stationRaw{
			code: "010902",
			name: "Petite rivière Cascapédia",
		}, actual[1])
	}
}
