package main

import (
  "github.com/globalsign/mgo/bson"
  "time"
  "fmt"
  "github.com/globalsign/mgo"
  "github.com/jmoiron/sqlx"
  "database/sql"
  "database/sql/driver"
  "encoding/json"
  "strings"
)

type LinestringZ [][]float64

func (l LinestringZ) Value() (driver.Value, error) {
  line := make([]string, len(l))
  for i := range l {
    alt := 0.0
    if len(l[i]) > 2 {
      alt = l[i][2]
    }
    line[i] = fmt.Sprintf("%f %f %f", l[i][0], l[i][1], alt)
  }
  return fmt.Sprintf("LINESTRINGZ( %s )", strings.Join(line, ", ")), nil
}

type GaugeBinding struct {
  Minimum     float64 `bson:"minimum" json:"minimum,omitempty"`
  Maximum     float64 `bson:"maximum" json:"maximum,omitempty"`
  Optimum     float64 `bson:"optimum" json:"optimum,omitempty"`
  Impossible  float64 `bson:"impossible" json:"impossible,omitempty"`
  Approximate bool    `bson:"approximate" json:"approximate"`
}

func (b GaugeBinding) Value() (driver.Value, error) {
  bytes, e := json.Marshal(b)
  return string(bytes), e
}

type SectionTranslation struct {
  SectionID   string
  Name        string     `bson:"name"`
  Description HtmlString `bson:"description"`
  FlowsText   string     `bson:"flowsText"`
  Season      string     `bson:"season"`
}

type Section struct {
  ID             bson.ObjectId   `bson:"_id"`
  RiverMongoId   bson.ObjectId   `bson:"riverId"`
  RiverID        sql.NullString
  GaugeMongoId   bson.ObjectId   `bson:"gaugeId"`
  GaugeID        sql.NullString
  AuthorMongoId  bson.ObjectId   `bson:"createdBy"`
  CreatedBy      sql.NullString
  Levels         GaugeBinding    `bson:"levels"`
  Flows          GaugeBinding    `bson:"flows"`
  MediaIds       []bson.ObjectId `bson:"mediaIds"`
  SupplyTagIds   []bson.ObjectId `bson:"supplyTagIds"`
  KayakingTagIds []bson.ObjectId `bson:"kayakingTagIds"`
  HazardsTagIds  []bson.ObjectId `bson:"hazardsTagIds"`
  MiscTagIds     []bson.ObjectId `bson:"miscTagIds"`
  PoiIds         []bson.ObjectId `bson:"poiIds"`
  CreatedAt      time.Time       `bson:"createdAt"`
  Difficulty     float64         `bson:"difficulty"`
  Gradient       *float64        `bson:"gradient"`
  Drop           *float64        `bson:"drop"`
  Distance       *float64        `bson:"distance"`
  SeasonNumeric  SeasonNumeric   `bson:"seasonNumeric"`
  Rating         *float64        `bson:"rating"`
  Shape          LinestringZ     `bson:"shape"`
  Duration       *int64          `bson:"duration"`
  DifficultyXtra *String32       `bson:"difficultyXtra"`
  SectionTranslation             `bson:",inline"`
}

func insertSections(mongo *mgo.Database, pg *sqlx.DB, uuids IdMap) error {
  var section Section
  collection := mongo.C("sections")

  sectionStmt, err := pg.PrepareNamed(`
    INSERT INTO sections(river_id, gauge_id, season_numeric, levels, flows, shape, distance, drop, duration, difficulty, difficulty_xtra, rating, created_by, created_at)
    VALUES (:river_id, :gauge_id, :season_numeric, :levels, :flows, :shape, :distance, :drop, :duration, :difficulty, :difficulty_xtra, :rating, :created_by, :created_at)
    RETURNING id
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare section statement: %s", err.Error())
  }

  transStmt, err := pg.PrepareNamed(`
    INSERT INTO sections_translations(section_id, name, description, season, flows_text)
    VALUES (:section_id, :name, :description, :season, :flows_text)
  `)
  if err != nil {
    return fmt.Errorf("failed to prepare sections translations statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&section) {
    section.CreatedBy = UUIDOrNull(uuids[section.AuthorMongoId])
    section.RiverID = UUIDOrNull(uuids[section.RiverMongoId])
    section.GaugeID = UUIDOrNull(uuids[section.GaugeMongoId])
    err := sectionStmt.QueryRowx(section).Scan(&section.SectionID)
    if err != nil {
      return fmt.Errorf("failed to insert section %v: %s", section.ID.Hex(), err.Error())
    }

    _, err = transStmt.Exec(section.SectionTranslation)

    if err != nil {
      return fmt.Errorf("couldn't insert section translation for section %v: %s", section.ID.Hex(), err.Error())
    }

    // Insert sections_media
    err = fillJunction(pg, "sections_media", "section_id", "media_id", uuids, section.SectionID, section.MediaIds)
    if err != nil {
      return err
    }

    // Insert sections_points
    err = fillJunction(pg, "sections_points", "section_id", "point_id", uuids, section.SectionID, section.PoiIds)
    if err != nil {
      return err
    }
    // Insert section_tags
    tagIds := []bson.ObjectId{}
    tagIds = append(tagIds, section.KayakingTagIds...)
    tagIds = append(tagIds, section.SupplyTagIds...)
    tagIds = append(tagIds, section.HazardsTagIds...)
    tagIds = append(tagIds, section.MiscTagIds...)
    err = fillJunction(pg, "sections_tags", "section_id", "tag_id", uuids, section.SectionID, tagIds)
    if err != nil {
      return err
    }

    uuids[section.ID] = section.SectionID
  }

  if err := iter.Close(); err != nil {
    return fmt.Errorf("couldn't close sections iterator: %s", err.Error())
  }

  return nil
}
