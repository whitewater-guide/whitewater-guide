package quebec

import (
	"core"
	"encoding/csv"
	"fmt"
	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
	"io"
	"strconv"
	"strings"
	"time"
)

func parseReadings(r io.Reader, tz *time.Location, script, code string) ([]core.Measurement, error) {
	reader := csv.NewReader(r)
	reader.Comma = '\t'
	var result []core.Measurement
	levelInd, flowInd := -1, -1
	for {
		line, err := reader.Read()
		if err == io.EOF {
			break
		} else if e, ok := err.(*csv.ParseError); ok && e.Err == csv.ErrFieldCount {
			continue
		} else if err != nil {
			return nil, err
		}
		if len(line) < 3 || len(line) > 5 {
			return nil, fmt.Errorf("unexpected csv format with %d rows insteas of 3 or 4", len(line))
		}
		if levelInd == -1 && flowInd == -1 {
			for i, v := range line {
				vt := strings.TrimSpace(v)
				if vt == "Niveau" {
					levelInd = i
				}
				if vt == "Débit" || vt == "DÈbit" {
					flowInd = i
				}
			}
			continue
		}
		ts, err := time.ParseInLocation("2006-01-02T15:04", line[0]+"T"+line[1], tz)
		if err != nil {
			return nil, err
		}
		var level, flow float64
		if levelInd != -1 {
			levelStr := line[levelInd]
			level, err = strconv.ParseFloat(strings.Replace(levelStr, ",", ".", -1), 64)
			if err != nil {
				return nil, err
			}
		}
		if flowInd != -1 {
			flowStr := line[flowInd]
			flow, err = strconv.ParseFloat(strings.Replace(flowStr, ",", ".", -1), 64)
			if err != nil {
				return nil, err
			}
		}
		result = append(result, core.Measurement{
			GaugeId: core.GaugeId{
				Script: script,
				Code:   code,
			},
			Level:     level,
			Flow:      flow,
			Timestamp: core.HTime{Time: ts},
		})
	}
	return result, nil
}

func getReadings(script, code string) ([]core.Measurement, error) {
	est, err := time.LoadLocation("EST")
	if err != nil {
		return nil, err
	}
	resp, err := core.Client.Get("https://www.cehq.gouv.qc.ca/suivihydro/fichier_donnees.asp?NoStation=" + code)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	reader := transform.NewReader(resp.Body, charmap.Windows1252.NewDecoder())
	return parseReadings(reader, est, script, code)
}
