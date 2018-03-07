package main

import (
  "github.com/globalsign/mgo"
  "os"
  "fmt"
)

func main() {
  mongoUri := os.Getenv("MONGO_URI")
  session, err := mgo.Dial(mongoUri)
  if err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't connect to mongo: %s", err.Error())
    os.Exit(1)
  }
  db := session.DB("wwdb")
  gaugesCollection := db.C("gauges")

  var gauge Gauge

  iGauges := gaugesCollection.Find(nil).Iter()
  for iGauges.Next(&gauge) {
    // fmt.Printf("Next gauge: %v", gauge)
    if gauge.RequestParams != nil {
      fmt.Printf("Next gauge: %v", gauge)
    }
  }
  if err := iGauges.Close(); err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't close users iterator: %s", err.Error())
    os.Exit(1)
  }
}
