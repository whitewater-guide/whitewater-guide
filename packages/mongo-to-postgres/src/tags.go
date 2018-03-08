package main

import (
  "github.com/globalsign/mgo/bson"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
)

type TagTranslation struct {
  Name     string `bson:"name"`
  Language string
}

type Tag struct {
  ID       bson.ObjectId `bson:"_id"`
  Slug     string        `bson:"slug"`
  TagTranslation         `bson:",inline"`
  Category string
}

func insertTags(db *mgo.Database, pg *sqlx.DB) (tagIds map[bson.ObjectId]string, err error) {
  collections := map[string]string{
    "hazard_tags":   "hazards",
    "kayaking_tags": "kayaking",
    "supply_tags":   "supply",
    "misc_tags":     "misc",
  }
  tagIds = make(map[bson.ObjectId]string)

  var tagStmt, transStmt *sqlx.NamedStmt

  tagStmt, err = pg.PrepareNamed("INSERT INTO tags(id, category) VALUES(:slug, :category)")
  if err != nil {
    return
  }
  transStmt, err = pg.PrepareNamed("INSERT INTO tags_translations(tag_id, language, name) VALUES (:slug, :language, :name)")
  if err != nil {
    return
  }

  var tag Tag
  for cName, cat := range collections {
    collection := db.C(cName)
    iter := collection.Find(nil).Iter()
    for iter.Next(&tag) {
      tag.Category, tag.Language = cat, "en"

      if _, err = tagStmt.Exec(tag); err != nil {
        return
      }
      if _, err = transStmt.Exec(tag); err != nil {
        return
      }
      tagIds[tag.ID] = tag.Slug
    }

    if err = iter.Close(); err != nil {
      return
    }

  }
  return
}
