package main

import (
  "github.com/globalsign/mgo/bson"
  "github.com/globalsign/mgo"
  "fmt"
  "os"
  "database/sql"
)

type Tag struct {
  ID   bson.ObjectId `bson:"_id"`
  Slug string        `bson:"slug"`
  Name string        `bson:"name"`
}

func insertTags(db *mgo.Database, pg *sql.DB) map[bson.ObjectId]string {
  collections := map[string]string{
    "hazard_tags":   "hazards",
    "kayaking_tags": "kayaking",
    "supply_tags":   "supply",
    "misc_tags":     "misc",
  }
  var tagIds = make(map[bson.ObjectId]string)
  var tag Tag
  for cName, cat := range collections {
    collection := db.C(cName)
    iter := collection.Find(nil).Iter()
    for iter.Next(&tag) {
      _, err := pg.Query(`INSERT INTO tags(id, category) VALUES($1, $2) RETURNING id`, tag.Slug, cat)
      if err != nil {
        fmt.Fprintf(os.Stderr, "Couldn't insert tag %v: %s", tag, err.Error())
      }
      _, err = pg.Query(
        "INSERT INTO tags_translations(tag_id, language, name) VALUES ($1, $2, $3)",
        tag.Slug, "en", tag.Name,
      )
      if err != nil {
        fmt.Fprintf(os.Stderr, "Couldn't insert translation %v: %s", tag, err.Error())
      }
      tagIds[tag.ID] = tag.Slug
    }

    if err := iter.Close(); err != nil {
      fmt.Fprintf(os.Stderr, "Couldn't close tags iterator: %s", err.Error())
      os.Exit(1)
    }

  }
  return tagIds
}
