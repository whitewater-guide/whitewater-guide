package quebec

import (
	"core"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetReferenceList(t *testing.T) {
	assert := assert.New(t)
	actual, err := getReferenceList("quebec")
	if assert.NoError(err) {
		expected := core.GaugeInfo{
			GaugeId: core.GaugeId{
				Code:   "01BG009",
				Script: "quebec",
			},
			FlowUnit: "m3/s",
			Location: core.Location{
				Latitude:  48.18611111111111,
				Longitude: -65.5586111111111,
			},
		}
		assert.Equal(expected, actual["01BG009"])
	}
}
