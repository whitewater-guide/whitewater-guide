package catalunya

import (
	"core"
	"encoding/json"
)

func fetchObservations() ([]DataSensor, error) {
	resp, err := core.Client.Get("http://aca-web.gencat.cat/sdim2/apirest/data/AFORAMENT-EST")

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	response := &CatalunyaData{}
	err = json.NewDecoder(resp.Body).Decode(response)
	if err != nil {
		return nil, err
	}
	return response.Sensors, err
}

func parseObservations(script string) ([]core.Measurement, error) {
	dataSensors, err := fetchObservations()
	if err != nil {
		return nil, err
	}
	var result []core.Measurement
	for _, sensor := range dataSensors {
		for _, observation := range sensor.Observations {
			var flow, level float64
			// observation data doesn't contain any mention of it's type
			// so this worker has to be stateful and use isFlowSensor
			if isFlowSensor[sensor.Sensor] {
				flow = observation.Value
			} else {
				level = observation.Value
			}
			result = append(result, core.Measurement{
				GaugeId: core.GaugeId{
					Script: script,
					Code:   sensor.Sensor,
				},
				Flow:      flow,
				Level:     level,
				Timestamp: core.HTime{Time: observation.Timestamp.Time},
			})
		}
	}
	return result, nil
}
