package catalunya

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestFetchObservations(t *testing.T) {
	assert := assert.New(t)
	sensors, err := fetchObservations()
	if assert.NoError(err) {
		assert.NotEqual(len(sensors), 0)
	}
}
