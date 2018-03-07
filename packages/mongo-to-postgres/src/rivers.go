package main

import (
  "github.com/globalsign/mgo/bson"
  "time"
)

type River struct {
  ID          bson.ObjectId `bson:"_id"`
  RegionId    bson.ObjectId `bson:"regionId"`
  Name        string        `bson:"name"`
  Description string        `bson:"description"`
  CreatedAt   time.Time     `bson:"createdAt"`
  UpdatedAt   time.Time     `bson:"updatedAt"`
  CreatedBy   bson.ObjectId `bson:"createdBy"`
  Hidden      bool          `bson:"hidden"`
}
