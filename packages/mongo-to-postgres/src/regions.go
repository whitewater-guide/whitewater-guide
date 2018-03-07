package main

import (
"github.com/globalsign/mgo/bson"
"time"
)

type Region struct {
  ID            bson.ObjectId   `bson:"_id"`
  PoiIds        []bson.ObjectId `bson:"poiIds"`
  Name          string          `bson:"name"`
  Description   string          `bson:"description"`
  Season        string          `bson:"season"`
  SeasonNumeric []int64         `bson:"seasonNumeric"`
  CreatedAt     time.Time       `bson:"createdAt"`
  UpdatedAt     time.Time       `bson:"updatedAt"`
  Bounds        [][]float64     `bson:"bounds"`
  Hidden        bool            `bson:"hidden"`
}
