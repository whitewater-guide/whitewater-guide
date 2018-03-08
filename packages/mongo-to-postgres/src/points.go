package main

import (
  "github.com/globalsign/mgo/bson"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
  "fmt"
  "database/sql/driver"
)

type Coordinates []float64

func (coord Coordinates) Value() (driver.Value, error) {
  lla := make([]float64, 3)
  copy(lla, coord)
  return fmt.Sprintf("POINTZ(%f %f %f)", lla[0], lla[1], lla[2]), nil
}

type PointTranslation struct {
  PointID     string
  Name        string `bson:"name"`
  Description string `bson:"description"`
}

type Point struct {
  ID          bson.ObjectId `bson:"_id"`
  Kind        string        `bson:"kind"`
  Coordinates Coordinates   `bson:"coordinates"`
  PointTranslation          `bson:",inline"`
}

func insertPoints(mongo *mgo.Database, pg *sqlx.DB, uuids IdMap) error {
  var point Point
  collection := mongo.C("points")

  pointStmt, err := pg.PrepareNamed(`
    INSERT INTO points(kind, coordinates)
    VALUES (:kind, ST_PointFromText(:coordinates, 4326))
    RETURNING id 
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare user statement: %s", err.Error())
  }

  transStmt, err := pg.PrepareNamed(`
    INSERT INTO points_translations(point_id, name, description) 
    VALUES (:point_id, :name, :description)
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare points translations statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&point) {
    err := pointStmt.QueryRowx(point).Scan(&point.PointID)
    if err != nil {
      return fmt.Errorf("failed to insert point %s: %s", point.ID.Hex(), err.Error())
    }

    _, err = transStmt.Exec(point.PointTranslation)

    if err != nil {
      return fmt.Errorf("couldn't insert point translation for point %v: %s", point.ID.Hex(), err.Error())
    }
    uuids[point.ID] = point.PointID
  }

  if err := iter.Close(); err != nil {
    return fmt.Errorf("couldn't close points iterator: %s", err.Error())
  }

  return nil
}
