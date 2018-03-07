package main

import "github.com/globalsign/mgo/bson"

type Gauge struct {
  ID            bson.ObjectId `bson:"_id"`
  SourceID      bson.ObjectId `bson:"sourceId"`
  Name          string        `bson:"name"`
  Code          string        `bson:"code"`
  Url           string        `bson:"url"`
  FlowUnit      string        `bson:"flowUnit"`
  LevelUnit     string        `bson:"levelUnit"`
  Cron          string        `bson:"cron"`
  Location      Point         `bson:"location"`
  RequestParams interface{}   `bson:"requestParams"`
}
