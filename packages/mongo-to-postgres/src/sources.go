package main

import (
  "github.com/globalsign/mgo/bson"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
  "fmt"
)

type SourceTranslation struct {
  SourceID   string
  Name       string     `bson:"name"`
  TermsOfUse HtmlString `bson:"termsOfUse"`
}

type Source struct {
  ID          bson.ObjectId   `bson:"_id"`
  Script      string          `bson:"script"`
  Cron        *NullableString `bson:"cron"`
  HarvestMode string          `bson:"harvestMode"`
  RegionIds   []bson.ObjectId `bson:"regionIds"`
  Url         *NullableString `bson:"url"`
  SourceTranslation           `bson:",inline"`
}

func insertSources(mongo *mgo.Database, pg *sqlx.DB, uuids IdMap, scripts IdMap) error {
  var source Source
  collection := mongo.C("sources")

  sourceStmt, err := pg.PrepareNamed(`
    INSERT INTO sources(script, cron, harvest_mode, url)
    VALUES (:script, :cron, :harvest_mode, :url)
    RETURNING id
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare source statement: %s", err.Error())
  }

  transStmt, err := pg.PrepareNamed(`
    INSERT INTO sources_translations(source_id, name, terms_of_use)
    VALUES (:source_id, :name, :terms_of_use)
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare sources translations statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&source) {
    if source.Script == "mockAllAtOnce" {
      source.Script = "all_at_once"
    } else if source.Script == "mockOneByOne" {
      source.Script = "one_by_one"
    }

    err := sourceStmt.QueryRowx(source).Scan(&source.SourceID)
    if err != nil {
      return fmt.Errorf("failed to insert source %v: %s", source.ID.Hex(), err.Error())
    }

    _, err = transStmt.Exec(source.SourceTranslation)

    if err != nil {
      return fmt.Errorf("couldn't insert source translation for source %v: %s", source.ID.Hex(), err.Error())
    }

    // Insert sources_points
    err = fillJunction(pg, "sources_regions", "source_id", "region_id", uuids, source.SourceID, source.RegionIds)
    if err != nil {
      return err
    }

    uuids[source.ID] = source.SourceID
    scripts[source.ID] = source.Script
  }

  if err := iter.Close(); err != nil {
    return fmt.Errorf("couldn't close sources iterator: %s", err.Error())
  }

  return nil
}
