package catalunya

import (
	"core"
	"encoding/json"
	"errors"
	"strconv"
	"strings"
)

func fetchList() ([]Sensor, error) {
	resp, err := core.Client.Get("http://aca-web.gencat.cat/sdim2/apirest/catalog?componentType=aforament")

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	response := &CatalunyaList{}
	err = json.NewDecoder(resp.Body).Decode(response)
	if err != nil {
		return nil, err
	}
	return response.Providers[0].Sensors, err
}

func convert(sensor Sensor, script string) (*core.GaugeInfo, error) {
	var locStr = strings.Split(sensor.Location, " ")
	if len(locStr) != 2 {
		return nil, errors.New("failed to parse location " + sensor.Location)
	}
	lat, err := strconv.ParseFloat(locStr[0], 64)
	if err != nil {
		return nil, errors.New("failed to parse latitude of " + sensor.Location)
	}
	lng, err := strconv.ParseFloat(locStr[1], 64)
	if err != nil {
		return nil, errors.New("failed to parse longitude of " + sensor.Location)
	}
	var levelUnit, flowUnit string
	switch sensor.Type {
	case "0014": // m3/s
		flowUnit = sensor.Unit
	case "0035": // l/s
		flowUnit = sensor.Unit
	case "0019": // cm
		levelUnit = sensor.Unit
	}
	return &core.GaugeInfo{
		GaugeId: core.GaugeId{
			Script: script,
			Code:   sensor.Sensor,
		},
		Name:      strings.Title(strings.ToLower(sensor.ComponentAdditionalInfo.Riu)) + " - " + sensor.ComponentDesc + " (" + levelUnit + flowUnit + ")",
		Url:       "http://aca-web.gencat.cat/sentilo-catalog-web/component/AFORAMENT-EST." + sensor.Component + "/detail",
		LevelUnit: levelUnit,
		FlowUnit:  flowUnit,
		Location: core.Location{
			Latitude:  lat,
			Longitude: lng,
		},
	}, nil
}

func parseList(script string) ([]core.GaugeInfo, error) {
	sensors, err := fetchList()

	if err != nil {
		return nil, err
	}

	var result []core.GaugeInfo
	for _, sensor := range sensors {
		if strings.Contains(strings.ToLower(sensor.Description), "canal") {
			continue
		}
		info, err := convert(sensor, script)
		if err != nil {
			return nil, err
		}
		result = append(result, *info)
	}

	return result, nil
}
