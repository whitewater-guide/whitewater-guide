package canada

import (
	"core"
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestTrimTz(t *testing.T) {
	assert.Equal(t, "2019-04-25T06:10:00", trimTz("2019-04-25T06:10:00-05:00"))
}

func TestGetPairedGauge(t *testing.T) {
	assert.Equal(t, "10KAX01", 	getPairedGauge("10KA001"))
	assert.Equal(t, "10KA001", 	getPairedGauge("10KAX01"))
	assert.Equal(t, "11AB108", 	getPairedGauge("11AB108"))
}

func TestConvertMeasurements(t *testing.T) {
	assert := assert.New(t)
	location, _ := time.LoadLocation("America/Montreal")
	timezones := make(map[string]*time.Location)
	timezones["02OB011"] = location
	expectedTime, _ := time.ParseInLocation("2006-01-02T15:04:05", "2019-04-25T05:50:00", location)
	mRaw := measurementRaw{
		id:          "02OB011",
		date:        "2019-04-25T05:50:00-05:00",
		level:       "7.522",
		levelGrade:  "",
		levelSymbol: "",
		levelQA:     "1",
		flow:        "",
		flowGrade:   "",
		flowSymbol:  "",
		flowQA:      "",
	}
	expected := core.Measurement{
		GaugeId: core.GaugeId{
			Code:   "02OB011",
			Script: "canada",
		},
		Timestamp: core.HTime{Time: expectedTime},
		Flow:      0,
		Level:     7.522,
	}
	actual, err := convertMeasurements(mRaw, timezones, "canada")
	if assert.NoError(err) {
		assert.Equal(expected, *actual)
	}
}
