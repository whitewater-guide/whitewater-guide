package main

import "github.com/globalsign/mgo/bson"

type Tag struct {
  ID   bson.ObjectId `bson:"_id"`
  Slug string        `bson:"slug"`
  Name string        `bson:"name"`
}
