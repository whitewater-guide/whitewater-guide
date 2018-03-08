package main

import (
  "github.com/globalsign/mgo/bson"
  "time"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
  "fmt"
  "database/sql/driver"
  "strings"
)

type PolygonZ [][]float64

func (coord PolygonZ) Value() (driver.Value, error) {
  poly := make([]string, len(coord)+1)
  for i := range coord {
    poly[i] = fmt.Sprintf("%f %f 0", coord[i][0], coord[i][1])
  }
  poly[len(coord)] = fmt.Sprintf("%f %f 0", coord[0][0], coord[0][1])
  return fmt.Sprintf("POLYGONZ(( %s ))", strings.Join(poly, ", ")), nil
}

type RegionTranslation struct {
  RegionID    string
  Name        string     `bson:"name"`
  Description HtmlString `bson:"description"`
  Season      string     `bson:"season"`
}

type Region struct {
  ID            bson.ObjectId   `bson:"_id"`
  PoiIds        []bson.ObjectId `bson:"poiIds"`
  SeasonNumeric SeasonNumeric   `bson:"seasonNumeric"`
  CreatedAt     time.Time       `bson:"createdAt"`
  Bounds        PolygonZ        `bson:"bounds"`
  Hidden        bool            `bson:"hidden"`
  RegionTranslation             `bson:",inline"`
}

func insertRegions(mongo *mgo.Database, pg *sqlx.DB, uuids IdMap) error {
  var region Region
  collection := mongo.C("regions")

  regionStmt, err := pg.PrepareNamed(`
    INSERT INTO regions(hidden, season_numeric, bounds, created_at)
    VALUES (:hidden, :season_numeric, ST_GeomFromText(:bounds, 4326), :created_at)
    RETURNING id
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare region statement: %s", err.Error())
  }

  transStmt, err := pg.PrepareNamed(`
    INSERT INTO regions_translations(region_id, name, description, season)
    VALUES (:region_id, :name, :description, :season)
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare regions translations statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&region) {
    err := regionStmt.QueryRowx(region).Scan(&region.RegionID)
    if err != nil {
      return fmt.Errorf("failed to insert region %v: %s", region.ID.Hex(), err.Error())
    }

    _, err = transStmt.Exec(region.RegionTranslation)

    if err != nil {
      return fmt.Errorf("couldn't insert region translation for region %v: %s", region.ID.Hex(), err.Error())
    }

    // Insert regions_points
    err = fillJunction(pg, "regions_points", "region_id", "point_id", uuids, region.RegionID, region.PoiIds)
    if err != nil {
      return err
    }

    uuids[region.ID] = region.RegionID
  }

  if err := iter.Close(); err != nil {
    return fmt.Errorf("couldn't close regions iterator: %s", err.Error())
  }

  return nil
}
