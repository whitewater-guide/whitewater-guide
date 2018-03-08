package main

import (
  "github.com/globalsign/mgo/bson"
  "fmt"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
  "database/sql/driver"
  "strings"
)

type MediaTranslation struct {
  MediaID     string
  Description string `bson:"description"`
  Copyright   string `bson:"copyright"`
}

type MediaResolution struct {
  Width  int64 `bson:"width"`
  Height int64 `bson:"height"`
}

func (res MediaResolution) Value() (driver.Value, error) {
  if res.Height == 0 && res.Width == 0 {
    return nil, nil
  }
  return fmt.Sprintf("{ %d, %d }", res.Width, res.Height), nil
}

type Media struct {
  ID         bson.ObjectId   `bson:"_id"`
  Kind       string          `bson:"type"`
  Url        string          `bson:"url"`
  MediaTranslation           `bson:",inline"`
  Resolution MediaResolution `bson:",inline"`
}

func insertMedia(mongo *mgo.Database, pg *sqlx.DB, uuids IdMap) error {
  var media Media
  collection := mongo.C("media")

  mediaStmt, err := pg.PrepareNamed(`
    INSERT INTO media(kind, url, resolution)
    VALUES (:kind, :url, :resolution)
    RETURNING id
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare media statement: %s", err.Error())
  }

  transStmt, err := pg.PrepareNamed(`
    INSERT INTO media_translations(media_id, description, copyright)
    VALUES (:media_id, :description, :copyright)
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare media translations statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&media) {
    // Fix some corrupted photos:
    if media.Kind == "photo" && strings.Index(media.Url, "http") == 0 {
      media.Kind = "video"
    }

    err := mediaStmt.QueryRowx(media).Scan(&media.MediaID)
    if err != nil {
      return fmt.Errorf("failed to insert media %v: %s", media.ID.Hex(), err.Error())
    }

    _, err = transStmt.Exec(media.MediaTranslation)

    if err != nil {
      return fmt.Errorf("couldn't insert media translation for media %v: %s", media.ID.Hex(), err.Error())
    }

    uuids[media.ID] = media.MediaID
  }

  if err := iter.Close(); err != nil {
    return fmt.Errorf("couldn't close media iterator: %s", err.Error())
  }

  return nil
}
