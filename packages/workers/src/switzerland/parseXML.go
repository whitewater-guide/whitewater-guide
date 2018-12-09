package switzerland

import (
	"core"
	"encoding/xml"
	"time"
)

const xmlURL = "https://www.hydrodaten.admin.ch/lhg/SMS.xml"

//const xmlURL = "https://gist.githubusercontent.com/doomsower/df9b9b7655531353a1b07017d157b89a/raw/288beb658506d4a60cc2ad97f6903130785d68e0/swiss.xml"

var units = map[string]string{"01": "m", "02": "m ü.M.", "10": "m3/s", "22": "l/s", "28": "cm"}
var flowPriorities = map[string]int{
	"10":   2,
	"m3/s": 2,
	"22":   1,
	"l/s":  1,
	"":     -1,
}
var levelPriorities = map[string]int{
	"01":     3,
	"m":      3,
	"02":     2,
	"m ü.M.": 2,
	"28":     1,
	"cm":     1,
	"":       -1,
}

func levelOrFlow(gauge Gauge) (unit string, priority int, isFlow bool) {
	flowPriority := flowPriorities[gauge.Type]
	levelPriority := levelPriorities[gauge.Type]
	if flowPriority > 0 {
		unit = units[gauge.Type]
		priority = flowPriority
		isFlow = true
	} else if levelPriority > 0 {
		unit = units[gauge.Type]
		priority = levelPriority
		isFlow = false
	}
	return
}

func getTimestamp(gauge Gauge) (core.HTime, error) {
	d, err := time.Parse("02.01.2006 15:04", gauge.Datum+" "+gauge.Zeit)
	if err != nil {
		return core.HTime{}, err
	}
	return core.HTime{d.UTC()}, nil
}

func getValue(gauge Gauge) float64 {
	for _, value := range gauge.Readings {
		if value.Type == "" && value.Delta == "" {
			return value.Value
		}
	}
	return 0
}

func parseXML(script string) (result []core.GaugeInfo, err error) {
	resp, err := core.Client.Get(xmlURL)

	if err != nil {
		return
	}
	defer resp.Body.Close()
	var data AKTData
	err = xml.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	byStation := make(map[string]core.GaugeInfo)
	for _, gauge := range data.Gauges {
		unit, priority, isFlow := levelOrFlow(gauge)
		timestamp, err := getTimestamp(gauge)
		value := getValue(gauge)
		if unit == "" || err != nil {
			continue
		}
		info, exists := byStation[gauge.Code]
		if !exists {
			info = core.GaugeInfo{
				GaugeId: core.GaugeId{
					Script: script,
					Code:   gauge.Code,
				},
				Measurement: core.Measurement{
					GaugeId: core.GaugeId{
						Script: script,
						Code:   gauge.Code,
					},
				},
			}
		}
		if isFlow {
			oldPriority := flowPriorities[info.FlowUnit]
			if priority > oldPriority {
				info.FlowUnit = unit
				info.Measurement.Timestamp = timestamp
				info.Measurement.Flow = value
			}
		} else {
			oldPriority := levelPriorities[info.LevelUnit]
			if priority > oldPriority {
				info.LevelUnit = unit
				info.Measurement.Timestamp = timestamp
				info.Measurement.Level = value
			}
		}
		byStation[gauge.Code] = info
	}
	result = make([]core.GaugeInfo, len(byStation))
	i := 0
	for _, v := range byStation {
		result[i] = v
		i++
	}
	return result, nil
}
