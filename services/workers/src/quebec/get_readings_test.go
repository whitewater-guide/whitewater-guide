package quebec

import (
	"core"
	"github.com/stretchr/testify/assert"
	"strings"
	"testing"
	"time"
)

func TestParseReadings(t *testing.T) {
	assert := assert.New(t)
	est, _ := time.LoadLocation("EST")
	readings := `Date      	Heure	Niveau 		DÈbit

2019-05-01	07:30	157,77		42,88
2019-05-01	07:15	157,77		42,81`
	measurements, err := parseReadings(strings.NewReader(readings), est, "quebec", "011508")
	if assert.NoError(err) {
		expectedTime := time.Date(2019, time.May, 1, 7, 30, 0, 0, est)
		expected := core.Measurement{
			GaugeId: core.GaugeId{
				Script: "quebec",
				Code:   "011508",
			},
			Timestamp: core.HTime{Time: expectedTime},
			Flow:      42.88,
			Level:     157.77,
		}
		assert.Equal(expected, measurements[0])
	}

	readings = `Date      	Heure	Débit

2019-05-01	08:00	119,4
2019-05-01	07:45	119,6`
	measurements, err = parseReadings(strings.NewReader(readings), est, "quebec", "011508")
	if assert.NoError(err) {
		expectedTime := time.Date(2019, time.May, 1, 8, 0, 0, 0, est)
		expected := core.Measurement{
			GaugeId: core.GaugeId{
				Script: "quebec",
				Code:   "011508",
			},
			Timestamp: core.HTime{Time: expectedTime},
			Flow:      119.4,
			Level:     0,
		}
		assert.Equal(expected, measurements[0])
	}

	readings = `Date      	Heure	Niveau 

2019-05-01	08:30	3,45
2019-05-01	08:15	3,45`
	measurements, err = parseReadings(strings.NewReader(readings), est, "quebec", "011508")
	if assert.NoError(err) {
		expectedTime := time.Date(2019, time.May, 1, 8, 30, 0, 0, est)
		expected := core.Measurement{
			GaugeId: core.GaugeId{
				Script: "quebec",
				Code:   "011508",
			},
			Timestamp: core.HTime{Time: expectedTime},
			Flow:      0,
			Level:     3.45,
		}
		assert.Equal(expected, measurements[0])
	}
}
