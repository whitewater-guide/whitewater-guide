package main

import (
  "github.com/globalsign/mgo"
  "os"
  "fmt"
  "github.com/globalsign/mgo/bson"
)

func main() {
  mongoUri := os.Getenv("MONGO_URI")
  fmt.Printf(mongoUri)
  session, err := mgo.Dial(mongoUri)
  if err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't connect to mongo: %s", err.Error())
    os.Exit(1)
  }
  db := session.DB("wwdb")
  usersCollection := db.C("users")

  var users []User

  err = usersCollection.Find(bson.M{}).All(&users)
  if err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't find users: %s", err.Error())
    os.Exit(1)
  }
  fmt.Println(users)
}