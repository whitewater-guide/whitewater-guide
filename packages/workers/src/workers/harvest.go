package main

import (
	"core"
	"github.com/fatih/structs"
	"github.com/sirupsen/logrus"
)

func harvest(db *DatabaseManager, cache *CacheManager, worker core.Worker, payload Payload) (int, error) {
	var saved = 0
	var lastMeasurement core.Measurement
	var ok bool
	// get last values from redis cache
	lastMeasurements := (*cache).LoadLastMeasurements(payload.Script, payload.Code)
	// set since value for one-by-one scripts
	if worker.HarvestMode() == core.OneByOne {
		key := core.GaugeId{Script: payload.Script, Code: payload.Code}
		if lastMeasurement, ok = lastMeasurements[key]; ok {
			payload.Since = lastMeasurement.Timestamp.UTC().Unix()
		}
	}
	// filter since, update last values
	measurements, err := worker.Harvest(payload.HarvestOptions)
	if err != nil {
		return 0, err
	}
	for _, m := range measurements {
		if lastMeasurement, ok = lastMeasurements[m.GaugeId]; !ok || m.Timestamp.After(lastMeasurement.Timestamp.Time) {
			lastMeasurements[m.GaugeId] = m
		}
	}
	if len(measurements) == 0 {
		logrus.WithFields(structs.Map(payload)).WithFields(structs.Map(payload.HarvestOptions)).Warn("harvested 0 measurements")
	}
	// Save to postgres
	saved, err = (*db).SaveMeasurements(measurements)
	if saved > 0 {
		(*cache).SaveLastMeasurements(lastMeasurements)
	}
	return saved, err
}
