package main

import "github.com/globalsign/mgo/bson"

type Point struct {
  ID          bson.ObjectId `bson:"_id"`
  Kind        string        `bson:"kind"`
  Name        string        `bson:"name"`
  Description string        `bson:"description"`
  Coordinates []float64     `bson:"coordinates"`
}
