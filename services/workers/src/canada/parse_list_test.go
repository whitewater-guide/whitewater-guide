package canada

import (
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func assertEqualLocations(assert *assert.Assertions, expected, actual *time.Location) {
	actualTime, _ := time.ParseInLocation("02 Jan 06 15:04", "02 Jan 06 15:04", actual)
	expectedTime, _ := time.ParseInLocation("02 Jan 06 15:04", "02 Jan 06 15:04", expected)
	assert.Equal(expectedTime.UnixNano(), actualTime.UnixNano(), "expected %v to equal %v", expected, actual)
}

func TestParseTimezone(t *testing.T) {
	assert := assert.New(t)
	actual, err := parseTimezone("UTC-03:30")
	//expected, _ := time.LoadLocation("America/Toronto")
	expected, _ := time.LoadLocation("America/St_Johns")
	if assert.NoError(err) {
		assertEqualLocations(assert, expected, actual)
	}
}

func TestFetchStationList(t *testing.T) {
	assert := assert.New(t)
	raws, err := fetchStationList()
	location, _ := time.LoadLocation("America/Moncton")
	if assert.NoError(err) {
		assert.NotEmpty(raws)
		assert.Equal(
			raws[0].id,
			"01AD003",
			"encoding failure, expected '01AD003', got '%s'",
			raws[0].id,
		)
		assert.Equal(
			raws[0].name,
			"ST. FRANCIS RIVER AT OUTLET OF GLASIER LAKE",
			"encoding failure, expected 'ST. FRANCIS RIVER AT OUTLET OF GLASIER LAKE', got '%s'",
			raws[0].name,
		)
		assert.Equal(
			raws[0].latitude,
			47.206610,
			"encoding failure, expected 47.206610, got '%v'",
			raws[0].latitude,
		)
		assert.Equal(
			raws[0].longitude,
			-68.956940,
			"encoding failure, expected -68.956940, got '%v'",
			raws[0].longitude,
		)
		assert.Equal(
			raws[0].province,
			"NB",
			"encoding failure, expected 'NB', got '%v'",
			raws[0].province,
		)
		assertEqualLocations(assert, location, raws[0].timezone)
	}
}
