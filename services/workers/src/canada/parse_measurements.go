package canada

import (
	"core"
	"encoding/csv"
	"errors"
	"fmt"
	log "github.com/sirupsen/logrus"
	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
	"io"
	"strconv"
	"strings"
	"time"
)

type measurementRaw struct {
	id          string // ID
	date        string // Date
	level       string // Water Level / Niveau d'eau (m)
	levelGrade  string // Grade
	levelSymbol string // Symbol / Symbole
	levelQA     string // QA/QC
	flow        string // Discharge / Débit (cms)
	flowGrade   string // Grade
	flowSymbol  string // Symbol / Symbole
	flowQA      string // QA/QC
}

func trimTz(date string) string {
	parts := strings.Split(date, "-")
	return strings.Join(parts[:len(parts)-1], "-")
}

// Sometimes gauge list would contain main gauge, but measurements list would contain auxiliary gauge for it or vise versa.
// Auxiliary gauges are marked with X character, main gauges have 0. Some gauges have 1, I dont't know what it means
// I could not find any documentation on this, so I know this by trial and error
func getPairedGauge(code string) string {
	char := code[len(code)-3]
	if char == '0' {
		return code[:len(code)-3] + "X" + code[len(code)-2:]
	} else if char == 'X' {
		return code[:len(code)-3] + "0" + code[len(code)-2:]
	}
	return code
}

func getTimezone(code string, timezones map[string]*time.Location) (*time.Location, error) {
	if timezone, ok := timezones[code]; ok {
		return timezone, nil
	}
	if timezone, ok := timezones[getPairedGauge(code)]; ok {
		return timezone, nil
	}
	return nil, fmt.Errorf("timezone not found for station %s", code)
}

func convertMeasurements(raw measurementRaw, timezones map[string]*time.Location, script string) (*core.Measurement, error) {
	var level, flow float64
	var err error
	if raw.level != "" {
		level, err = strconv.ParseFloat(raw.level, 64)
		if err != nil {
			return nil, err
		}
	}
	if raw.flow != "" {
		flow, err = strconv.ParseFloat(raw.flow, 64)
		if err != nil {
			return nil, err
		}
	}
	timezone, err := getTimezone(raw.id, timezones)
	if err != nil {
		return nil, err
	}
	t, err := time.ParseInLocation("2006-01-02T15:04:05", trimTz(raw.date), timezone)
	if err != nil {
		return nil, err
	}
	return &core.Measurement{
		GaugeId: core.GaugeId{
			Script: script,
			Code:   raw.id,
		},
		Level:     level,
		Flow:      flow,
		Timestamp: core.HTime{Time: t},
	}, nil
}

func fetchMeasurements(script, province string) ([]core.Measurement, error) {
	if province == "" {
		return nil, errors.New("province is required")
	}
	resp, err := core.Client.Get(fmt.Sprintf("https://dd.weather.gc.ca/hydrometric/csv/%s/hourly/%s_hourly_hydrometric.csv", province, province))
	if err != nil {
		return nil, err
	}
	timezones, err := getStationTimezones()
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	reader := csv.NewReader(transform.NewReader(resp.Body, charmap.Windows1252.NewDecoder()))
	reader.Comma = ','
	var result []core.Measurement
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
		if len(line) != 10 {
			return nil, fmt.Errorf("unexpected csv format with %d rows insteas of 10", len(line))
		}
		if !skippedTitle {
			skippedTitle = true
			continue
		}
		mRaw := measurementRaw{
			id:          line[0],
			date:        line[1],
			level:       line[2],
			levelGrade:  line[3],
			levelSymbol: line[4],
			levelQA:     line[5],
			flow:        line[6],
			flowGrade:   line[7],
			flowSymbol:  line[8],
			flowQA:      line[9],
		}
		measurement, err := convertMeasurements(mRaw, timezones, script)
		if err == nil {
			result = append(result, *measurement)
		} else {
			log.WithFields(log.Fields{
				"script":   "canada",
				"command":  "harvest",
				"province": province,
				"code": mRaw.id,
			}).Warn(err)
		}
	}
	return result, nil
}
