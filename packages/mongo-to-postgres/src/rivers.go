package main

import (
  "github.com/globalsign/mgo/bson"
  "time"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
  "fmt"
  "database/sql"
)

type RiverTranslation struct {
  RiverID string
  Name    string `bson:"name"`
  // Description string `bson:"description"`
}

type River struct {
  ID        bson.ObjectId `bson:"_id"`
  RegId     bson.ObjectId `bson:"regionId"` // raw mongo id
  RegionId  string                          // mapped UUID
  CreatedAt time.Time     `bson:"createdAt"`
  AuthorId  bson.ObjectId `bson:"createdBy"` // raw mongo id
  CreatedBy sql.NullString                   // mapped UUID
  RiverTranslation        `bson:",inline"`
}

func insertRivers(mongo *mgo.Database, pg *sqlx.DB, uuids IdMap) error {
  var river River
  collection := mongo.C("rivers")

  riverStmt, err := pg.PrepareNamed(`
    INSERT INTO rivers(region_id, created_by, created_at)
    VALUES (:region_id, :created_by, :created_at)
    RETURNING id
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare river statement: %s", err.Error())
  }

  transStmt, err := pg.PrepareNamed(`
    INSERT INTO rivers_translations(river_id, name)
    VALUES (:river_id, :name)
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare rivers translations statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&river) {
    river.RegionId = uuids[river.RegId]
    river.CreatedBy = UUIDOrNull(uuids[river.AuthorId])
    err := riverStmt.QueryRowx(river).Scan(&river.RiverID)
    if err != nil {
      return fmt.Errorf("failed to insert river %v: %s", river.ID.Hex(), err.Error())
    }

    _, err = transStmt.Exec(river.RiverTranslation)

    if err != nil {
      return fmt.Errorf("couldn't insert river translation for river %v: %s", river.ID.Hex(), err.Error())
    }

    uuids[river.ID] = river.RiverID
  }

  if err := iter.Close(); err != nil {
    return fmt.Errorf("couldn't close rivers iterator: %s", err.Error())
  }

  return nil
}
