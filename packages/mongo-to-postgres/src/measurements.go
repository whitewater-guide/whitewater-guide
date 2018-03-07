package main

import (
"github.com/globalsign/mgo/bson"
"time"
)

type Measurement struct {
  ID      bson.ObjectId `bson:"_id"`
  GaugeID bson.ObjectId `bson:"gaugeId"`
  Date    time.Time     `bson:"date"`
  Level   float64       `bson:"level"`
  Flow    float64       `bson:"flow"`
}
