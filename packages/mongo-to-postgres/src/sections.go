package main

import (
  "github.com/globalsign/mgo/bson"
  "time"
)

type GaugeBinding struct {
  Minimum     float64 `bson:"minimum"`
  Maximum     float64 `bson:"maximum"`
  Optimum     float64 `bson:"optimum"`
  Impossible  float64 `bson:"impossible"`
  Approximate float64 `bson:"approximate"`
}

type SectionTranslation struct {
  SectionID string
  Name           string          `bson:"name"`
  Description    string          `bson:"description"`
  FlowsText      string          `bson:"flowsText"`
  Season         string          `bson:"season"`
}

type Section struct {
  ID             bson.ObjectId   `bson:"_id"`
  RiverId        bson.ObjectId   `bson:"riverId"`
  GaugeId        bson.ObjectId   `bson:"gaugeId"`
  Levels         GaugeBinding    `bson:"levels"`
  Difficulty     float64         `bson:"difficulty"`
  SupplyTagIds   []bson.ObjectId `bson:"supplyTagIds"`
  KayakingTagIds []bson.ObjectId `bson:"kayakingTagIds"`
  HazardsTagIds  []bson.ObjectId `bson:"hazardsTagIds"`
  MiscTagIds     []bson.ObjectId `bson:"miscTagIds"`
  CreatedAt      time.Time       `bson:"createdAt"`
  MediaIds       []bson.ObjectId `bson:"mediaIds"`
  CreatedBy      bson.ObjectId   `bson:"createdBy"`
  Gradient       float64         `bson:"gradient"`
  Distance       float64         `bson:"distance"`
  PoiIds         []bson.ObjectId `bson:"poiIds"`
  SeasonNumeric  []int64         `bson:"seasonNumeric"`
  Rating         float64         `bson:"rating"`
  UpdatedAt      time.Time       `bson:"updatedAt"`
  Flows          GaugeBinding    `bson:"flows"`
  Shape          [][]float64     `bson:"shape"`
  Duration       int64           `bson:"duration"`
  DifficultyXtra string          `bson:"difficultyXtra"`
}
