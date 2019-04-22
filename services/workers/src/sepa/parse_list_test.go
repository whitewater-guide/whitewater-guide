package sepa

import (
  "core"
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestParseRawCsv(t *testing.T) {
  assert := assert.New(t)
  result, err := parseRawCsv()

  if assert.NoError(err) {
    assert.Equal("Perth", result[0].stationName)
  }
}

func TestGetGaugeInfo(t *testing.T) {
  assert := assert.New(t)
  raw := csvRaw{
    sepaHydrologyOffice:   "Perth",
    stationName:           "Perth",
    locationCode:          "10048",
    nationalGridReference: "NO1160525332",
    catchmentName:         "---",
    riverName:             "Tay",
    gaugeDatum:            "2.08",
    catchmentArea:         "4991.0",
    startDate:             "Aug-91",
    endDate:               "07/04/2019 06:45",
    systemId:              "58156010",
    lowestValue:           "0.0",
    low:                   "0.161",
    maxValue:              "4.928",
    high:                  "3.493",
    maxDisplay:            "4.928m @ 17/01/1993 19:30:00",
    mean:                  "0.884",
    units:                 "m",
    webMessage:            "",
    nrfaLink:              "https://nrfa.ceh.ac.uk/data/station/info/15042",
  }

  result, err := getGaugeInfo(raw, "sepa")

  if assert.NoError(err) {
    assert.Equal(core.GaugeInfo{
      GaugeId: core.GaugeId{
        Code:   "10048",
        Script: "sepa",
      },
      Name:      "Tay - Perth",
      LevelUnit: "m",
      FlowUnit:  "",
      Location: core.Location{
        Latitude:  56.411915,
        Longitude: -3.434206,
        Altitude:  2.08,
      },
      Url: "http://apps.sepa.org.uk/waterlevels/default.aspx?sd=t&lc=10048",
    },
      result,
    )
  }
}

func TestParseList(t *testing.T) {
  assert := assert.New(t)
  result, err := parseList("sepa")
  if assert.NoError(err) {
    assert.Equal(core.GaugeInfo{
      GaugeId: core.GaugeId{
        Code:   "10048",
        Script: "sepa",
      },
      Name:      "Tay - Perth",
      LevelUnit: "m",
      FlowUnit:  "",
      Location: core.Location{
        Latitude:  56.411915,
        Longitude: -3.434206,
        Altitude:  2.08,
      },
      Url: "http://apps.sepa.org.uk/waterlevels/default.aspx?sd=t&lc=10048",
    },
      result[0],
    )

  }
}
