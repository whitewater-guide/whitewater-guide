package quebec

import (
	"core"
	"encoding/csv"
	"fmt"
	"io"
)

func getReferenceList(script string) (map[string]core.GaugeInfo, error) {
	resp, err := core.Client.Get("https://wateroffice.ec.gc.ca/station_metadata/reference_index_download_e.html")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	reader := csv.NewReader(resp.Body)
	reader.Comma = ','
	reader.LazyQuotes = true
	result := make(map[string]core.GaugeInfo)
	skippedTitle := false
	for {
		line, err := reader.Read()
		if err == io.EOF {
			break
		} else if e, ok := err.(*csv.ParseError); ok && e.Err == csv.ErrFieldCount {
			continue
		} else if err != nil {
			return nil, err
		}
		if len(line) != 18 {
			return nil, fmt.Errorf("unexpected csv format with %d rows insteas of 18", len(line))
		}
		if !skippedTitle {
			skippedTitle = true
			continue
		}
		code := line[0]
		lat, err := convertDMS(line[2])
		if err != nil {
			return nil, fmt.Errorf("failed to parse latitude '%s'", line[2])
		}
		lon, err := convertDMS(line[3])
		if err != nil {
			return nil, fmt.Errorf("failed to parse longtitude '%s'", line[3])
		}
		dataType := line[9]
		// B = Discharge and Water Level
		// H = Water level
		// Q = Discharge
		var level, flow string
		if old, ok := result[code]; ok {
			level = old.LevelUnit
			flow = old.FlowUnit
		}
		if level == "" && (dataType == "B" || dataType == "H") {
			level = "m"
		}
		if flow == "" && (dataType == "B" || dataType == "Q") {
			flow = "m3/s"
		}

		station := core.GaugeInfo{
			GaugeId: core.GaugeId{
				Code:   code,
				Script: script,
			},
			Location: core.Location{
				Latitude:  lat,
				Longitude: -lon,
			},
			LevelUnit: level,
			FlowUnit:  flow,
		}

		result[code] = station
	}
	return result, nil
}
