package main

import (
  "github.com/globalsign/mgo/bson"
)

type Source struct {
  ID          bson.ObjectId   `bson:"_id"`
  Name        string          `bson:"name"`
  Script      string          `bson:"script"`
  Cron        string          `bson:"cron"`
  HarvestMode string          `bson:"harvestMode"`
  RegionIds   []bson.ObjectId `bson:"regionIds"`
  TermsOfUse  string          `bson:"termsOfUse"`
  Url         string          `bson:"url"`
}
