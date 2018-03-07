package main

import "github.com/globalsign/mgo/bson"

type Media struct {
  ID          bson.ObjectId `bson:"_id"`
  Type        string        `bson:"type"`
  Description string        `bson:"description"`
  Url         string        `bson:"url"`
  Copyright   string        `bson:"copyright"`
  Width       int64         `bson:"width"`
  Height      int64         `bson:"height"`
}
