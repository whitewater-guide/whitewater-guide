package quebec

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestParsePage(t *testing.T) {
	assert := assert.New(t)
	actual, err := parsePage("000091")
	expected := stationInfo{
		code:        "000091",
		name:        "Lac Saint-Louis",
		isLocal:     false,
		federalCode: "02OA039",
	}
	if assert.NoError(err) {
		assert.Equal(expected, *actual)
	}
}
