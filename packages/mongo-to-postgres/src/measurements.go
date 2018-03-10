package main

import (
  "github.com/globalsign/mgo/bson"
  "time"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
  "fmt"
  "github.com/lib/pq"
)

type Measurement struct {
  ID      bson.ObjectId `bson:"_id"`
  GaugeID bson.ObjectId `bson:"gaugeId"`
  Date    time.Time     `bson:"date"`
  Level   float64       `bson:"level"`
  Flow    float64       `bson:"flow"`
}

type MeasurementsKey struct {
  Script string
  Code   string
}

type GaugesToKeys map[bson.ObjectId]MeasurementsKey

func insertMeasurements(mongo *mgo.Database, pg *sqlx.DB, maxAge int64, mKeys GaugesToKeys) (int, error) {
  var m Measurement
  count := 0
  collection := mongo.C("measurements")

  tx, err := pg.Begin()
  if err != nil {
    return count, err
  }
  stmt, err := tx.Prepare(pq.CopyIn("measurements", "timestamp", "script", "code", "flow", "level"))
  if err != nil {
    return count, err
  }

  var query interface{} = nil
  if maxAge > 0 {
    since := time.Now().Add(time.Duration(-24*maxAge) * time.Hour)
    query = bson.M{
      "date": bson.M{
        "$gte": since,
      },
    }
  }

  iter := collection.Find(query).Iter()
  for iter.Next(&m) {
    key := mKeys[m.GaugeID]
    if len(key.Code) == 0 { // Most likely it's mock script
      continue
    }
    _, err = stmt.Exec(m.Date, key.Script, key.Code, m.Flow, m.Level)
    if err != nil {
      return count, err
    }
    count++
  }

  _, err = stmt.Exec()
  if err != nil {
    return count, err
  }

  err = stmt.Close()
  if err != nil {
    return count, err
  }

  err = tx.Commit()
  if err != nil {
    return count, err
  }

  if err := iter.Close(); err != nil {
    return count, fmt.Errorf("couldn't close measurements iterator: %s", err.Error())
  }

  return count, nil
}
