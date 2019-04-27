package canada

import (
	"core"
	"encoding/csv"
	"fmt"
	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
	"io"
	"regexp"
	"strconv"
	"time"
)

const CSV_URL = "http://dd.weather.gc.ca/hydrometric/doc/hydrometric_StationList.csv"

type station struct {
	id        string // ID,
	name      string // Name / Nom,
	latitude  float64
	longitude float64
	province  string         //Prov/Terr
	timezone  *time.Location // Timezone / Fuseau horaire
}

var canadianStations []station
var stationTimezones map[string]*time.Location

func parseTimezone(tz string) (*time.Location, error) {
	re, err := regexp.Compile(`^(UTC-(\d+):(\d+))`)
	if err != nil {
		return nil, err
	}

	matches := re.FindStringSubmatch(tz)
	if len(matches) != 4 {
		return nil, fmt.Errorf("failed to parse timezone '%s': unexpected match length %d", tz, len(matches))
	}
	hours, err := strconv.ParseInt(matches[2], 10, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse timezone hours: '%s': %s", tz, err)
	}
	mins, err := strconv.ParseInt(matches[3], 10, 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse timezone minutes: '%s': %s", tz, err)
	}
	return time.FixedZone(tz, -1*int(hours)*60*60-int(mins)*60), nil
}

func fetchStationList() ([]station, error) {
	resp, err := core.Client.Get(CSV_URL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	reader := csv.NewReader(transform.NewReader(resp.Body, charmap.Windows1252.NewDecoder()))
	reader.Comma = ','
	var result []station
	skippedTitle := false
	for {
		line, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			return nil, err
		}
		if len(line) != 6 {
			return nil, fmt.Errorf("unexpected csv format with %d rows insteas of 6", len(line))
		}
		if !skippedTitle {
			skippedTitle = true
			continue
		}
		lat, err := strconv.ParseFloat(line[2], 64)
		if err != nil {
			return nil, fmt.Errorf("failed to parse latitude '%s'", line[2])
		}
		lon, err := strconv.ParseFloat(line[3], 64)
		if err != nil {
			return nil, fmt.Errorf("failed to parse longtitude '%s'", line[3])
		}
		loc, err := parseTimezone(line[5])
		if err != nil {
			return nil, err
		}

		result = append(result, station{
			id:        line[0],
			name:      line[1],
			latitude:  lat,
			longitude: lon,
			province:  line[4],
			timezone:  loc,
		})
	}
	return result, nil
}

func getStationList() ([]station, error) {
	if canadianStations == nil {
		stations, err := fetchStationList()
		if err != nil {
			return nil, err
		}
		canadianStations = stations
	}
	return canadianStations, nil
}

func getStationTimezones() (map[string]*time.Location, error) {
	if stationTimezones == nil {
		stations, err := getStationList()
		if err != nil {
			return nil, err
		}
		stationTimezones = make(map[string]*time.Location)
		for _, v := range stations {
			stationTimezones[v.id] = v.timezone
		}
	}
	return stationTimezones, nil
}
