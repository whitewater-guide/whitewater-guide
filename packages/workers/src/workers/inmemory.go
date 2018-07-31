package main

import "core"

type inmemoryDB struct{
  lastMeasurements map[core.GaugeId]core.Measurement
}

// DatabaseManager implementation
func (db *inmemoryDB) SaveMeasurements(measurements []core.Measurement) (int, error) {
  // noop
  return len(measurements), nil
}

// CacheManager implementation
func (db *inmemoryDB) SaveOpLog(script, code string, err error, count int) {
  // no-op
}

func (db *inmemoryDB) LoadLastMeasurements(script, code string) map[core.GaugeId]core.Measurement {
  result := make(map[core.GaugeId]core.Measurement)
  for k, v := range db.lastMeasurements {
    if k.Script == script && (code == "" || code == k.Code) {
      result[core.GaugeId{ Code: code, Script: script}] = v
    }
  }
  return result
}

func (db *inmemoryDB) SaveLastMeasurements(values map[core.GaugeId]core.Measurement) {
  for k, v := range values {
    db.lastMeasurements[k] = v
  }
}

func NewInmemoryDB() *inmemoryDB {
  db := &inmemoryDB{}
  db.lastMeasurements = make(map[core.GaugeId]core.Measurement)
  return db
}
