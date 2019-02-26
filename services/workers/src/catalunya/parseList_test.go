package catalunya

import (
	"core"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestFetchList(t *testing.T) {
	assert := assert.New(t)
	sensors, err := fetchList()
	if assert.NoError(err) {
		assert.NotEqual(len(sensors), 0)
		for _, sensor := range sensors {
			assert.Contains([]string{"0014", "0019", "0035"}, sensor.Type)
			assert.Contains([]string{"m³/s", "cm", "l/s"}, sensor.Unit)
			assert.Equal(sensor.TimeZone, "CET")
			assert.Equal(sensor.DataType, "NUMBER")
			assert.Equal(sensor.PublicAccess, true)
		}
	}
}

func TestConvert(t *testing.T) {
	assert := assert.New(t)
	input := Sensor{
		Sensor:                "431652-001-ANA001",
		Description:           "Nivell riu",
		DataType:              "NUMBER",
		Location:              "41.233966843 1.33729486",
		Type:                  "0019",
		Unit:                  "cm",
		TimeZone:              "CET",
		PublicAccess:          true,
		Component:             "431652-001",
		ComponentType:         "aforament",
		ComponentDesc:         "Vilabella",
		ComponentPublicAccess: true,
		AdditionalInfo: AdditionalInfo{
			TempsMostreigMin: "5",
			RangMNim:         "0",
			RangMXim:         "10",
		},
		ComponentAdditionalInfo: ComponentAdditionalInfo{
			Comarca:                "ALT CAMP",
			Provincia:              "TARRAGONA",
			Riu:                    "RIU GAIÀ",
			DistricteFluvial:       "ACA",
			SuperficieConcaDrenada: "329,73 km²",
			Subconca:               "EL GAIÀ",
			TermeMunicipal:         "VILABELLA",
			Conca:                  "EL GAIÀ",
		},
		ComponentTechnicalDetails: ComponentTechnicalDetails{
			Producer:     "",
			Model:        "",
			SerialNumber: "",
			MacAddress:   "",
			Energy:       "",
			Connectivity: "",
		},
	}
	info, err := convert(input, "catalunya")
	if assert.NoError(err) {
		assert.Equal(core.GaugeInfo{
			GaugeId: core.GaugeId{
				Script: "catalunya",
				Code:   "431652-001-ANA001",
			},
			Name:      "Riu Gaià - Vilabella (cm)",
			LevelUnit: "cm",
			Url:       "http://aca-web.gencat.cat/sentilo-catalog-web/component/AFORAMENT-EST.431652-001/detail",
			Location: core.Location{
				Latitude:  41.233966843,
				Longitude: 1.33729486,
			},
		}, *info)
	}
}
