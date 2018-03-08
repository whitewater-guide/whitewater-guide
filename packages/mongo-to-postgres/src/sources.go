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
  Cron        string          `bson:"cron"`
  HarvestMode string          `bson:"harvestMode"`
  RegionIds   []bson.ObjectId `bson:"regionIds"`
  Url         string          `bson:"url"`
  SourceTranslation           `bson:",inline"`
}

func insertSources(mongo *mgo.Database, pg *sqlx.DB, regions *IdMap) (IdMap, error) {
  var sourceIds = make(IdMap)
  var source Source
  collection := mongo.C("sources")

  sourceStmt, err := pg.PrepareNamed(`
    INSERT INTO sources(script, cron, harvest_mode, url)
    VALUES (:script, :cron, :harvest_mode, :url)
    RETURNING id
  `)
  if err != nil {
    return sourceIds, fmt.Errorf("failed to prepare source statement: %s", err.Error())
  }

  transStmt, err := pg.PrepareNamed(`
    INSERT INTO sources_translations(source_id, name, terms_of_use)
    VALUES (:source_id, :name, :terms_of_use)
  `)
  if err != nil {
    return sourceIds, fmt.Errorf("failed to prepare sources translations statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&source) {
    err := sourceStmt.QueryRowx(source).Scan(&source.SourceID)
    if err != nil {
      return sourceIds, fmt.Errorf("failed to insert source %v: %s", source.ID.Hex(), err.Error())
    }

    _, err = transStmt.Exec(source.SourceTranslation)

    if err != nil {
      return sourceIds, fmt.Errorf("couldn't insert source translation for source %v: %s", source.ID.Hex(), err.Error())
    }

    // Insert sources_points
    err = fillJunction(pg, "sources_regions", "source_id", "region_id", regions, source.SourceID, source.RegionIds)
    if err != nil {
      return sourceIds, err
    }

    sourceIds[source.ID] = source.SourceID
  }

  if err := iter.Close(); err != nil {
    return sourceIds, fmt.Errorf("couldn't close sources iterator: %s", err.Error())
  }

  return sourceIds, nil
}
