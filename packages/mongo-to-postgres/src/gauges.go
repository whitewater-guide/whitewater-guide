package main

import (
  "github.com/globalsign/mgo/bson"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
  "fmt"
  "database/sql/driver"
  "encoding/json"
  "database/sql"
)

type GaugeTranslation struct {
  GaugeID string
  Name    string `bson:"name"`
}

type RequestParams bson.M

func (rp RequestParams) Value() (driver.Value, error) {
  bytes, e := json.Marshal(rp)
  return string(bytes), e
}

type Gauge struct {
  ID            bson.ObjectId `bson:"_id"`
  SrcID         bson.ObjectId `bson:"sourceId"` // Raw from mongo
  SourceID      string                          // UUID, mapped raw
  Code          string        `bson:"code"`
  Url           string        `bson:"url"`
  FlowUnit      string        `bson:"flowUnit"`
  LevelUnit     string        `bson:"levelUnit"`
  Cron          string        `bson:"cron"`
  Location      Point         `bson:"location"`
  LocationID    sql.NullString
  RequestParams RequestParams `bson:"requestParams"`
  GaugeTranslation            `bson:",inline"`
}

func insertGauges(mongo *mgo.Database, pg *sqlx.DB, sources *IdMap, points *IdMap) (IdMap, error) {
  var gaugeIds = make(IdMap)
  var gauge Gauge
  collection := mongo.C("gauges")

  gaugeStmt, err := pg.PrepareNamed(`
    INSERT INTO gauges(source_id, location_id, code, level_unit, flow_unit, cron, request_params, url)
    VALUES (:source_id, :location_id, :code, :level_unit, :flow_unit, :cron, :request_params, :url)
    RETURNING id
  `)
  if err != nil {
    return gaugeIds, fmt.Errorf("failed to prepare gauge statement: %s", err.Error())
  }

  transStmt, err := pg.PrepareNamed(`
    INSERT INTO gauges_translations(gauge_id, name)
    VALUES (:gauge_id, :name)
  `)
  if err != nil {
    return gaugeIds, fmt.Errorf("failed to prepare gauges translations statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&gauge) {
    gauge.SourceID = (*sources)[gauge.SrcID]
    gauge.LocationID = sql.NullString{(*points)[gauge.Location.ID], gauge.Location.ID != ""}

    err := gaugeStmt.QueryRowx(gauge).Scan(&gauge.GaugeID)
    if err != nil {
      return gaugeIds, fmt.Errorf("failed to insert gauge %v: %s", gauge.ID.Hex(), err.Error())
    }

    _, err = transStmt.Exec(gauge.GaugeTranslation)

    if err != nil {
      return gaugeIds, fmt.Errorf("couldn't insert gauge translation for gauge %v: %s", gauge.ID.Hex(), err.Error())
    }

    gaugeIds[gauge.ID] = gauge.GaugeID
  }

  if err := iter.Close(); err != nil {
    return gaugeIds, fmt.Errorf("couldn't close gauges iterator: %s", err.Error())
  }

  return gaugeIds, nil
}
