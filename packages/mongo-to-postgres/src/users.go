package main

import (
  "time"
  "github.com/globalsign/mgo/bson"
)

type Facebook struct {
  ID        string `bson:"id"`
  Email     string `bson:"email"`
  Name      string `bson:"name"`
  FirstName string `bson:"first_name"`
  LastName  string `bson:"last_name"`
  Link      string `bson:"link"`
  Locale    string `bson:"locale"`
}

type Services struct {
  Facebook Facebook `bson:"facebook"`
}

type Roles struct {
  GlobalRoles []string `bson:"__global_roles__"`
}

type User struct {
  ID        bson.ObjectId `bson:"_id"`
  CreatedAt time.Time     `bson:"createdAt"`
  Services  Services      `bson:"services"`
  Roles     Roles         `bson:"roles"`
}
