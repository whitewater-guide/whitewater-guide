package main

import (
  "github.com/globalsign/mgo"
  "os"
  "fmt"
  _ "github.com/lib/pq"
  "strings"
  "github.com/lib/pq"
  "github.com/jmoiron/sqlx"
)

func main() {
  mongoUri := os.Getenv("MONGO_URI")
  session, err := mgo.Dial(mongoUri)
  if err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't connect to mongo: %s", err.Error())
    os.Exit(1)
  }
  mongo := session.DB("wwdb")

  pgConnStr := fmt.Sprintf(
    "postgres://postgres:%s@localhost/%s?sslmode=disable",
    os.Getenv("PGPASSWORD"),
    os.Getenv("POSTGRES_DB"),
  )
  pg, err := sqlx.Open("postgres", pgConnStr)
  if err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't connect to postgres: %s", err.Error())
    os.Exit(1)
  }
  pg.MapperFunc(ToSnake)

  clearPg(pg)

  tags, err := insertTags(mongo, pg)
  if err != nil {
    fmt.Printf("Error while inserting tags: %s\n", err.Error())
    os.Exit(1)
  }

  users, err := insertUsers(mongo, pg)
  if err != nil {
    fmt.Printf("Error while inserting users: %s\n", err.Error())
    os.Exit(1)
  }

  points, err := insertPoints(mongo, pg)
  if err != nil {
    fmt.Printf("Error while inserting points: %s\n", err.Error())
    os.Exit(1)
  }

  regions, err := insertRegions(mongo, pg, &points)
  if err != nil {
    fmt.Printf("Error while inserting regions: %s\n", err.Error())
    os.Exit(1)
  }

  sources, err := insertSources(mongo, pg, &regions)
  if err != nil {
    fmt.Printf("Error while inserting regions: %s\n", err.Error())
    os.Exit(1)
  }

  fmt.Printf("Inserted %d tags\n", len(tags))
  fmt.Printf("Inserted %d users\n", len(users))
  fmt.Printf("Inserted %d points\n", len(points))
  fmt.Printf("Inserted %d regions\n", len(regions))
  fmt.Printf("Inserted %d sources\n", len(sources))
}

func clearPg(pg *sqlx.DB) {
  tables := []string{
    "sources_regions",
    "logins",
    "users",
    "gauges",
    "gauges_translations",
    "sections",
    "sections_translations",
    "sections_points",
    "sections_tags",
    "sections_media",
    "sources",
    "sources_translations",
    "regions",
    "regions_translations",
    "regions_points",
    "points",
    "points_translations",
    "rivers",
    "rivers_translations",
    "tags",
    "tags_translations",
    "measurements",
    "media",
    "media_translations",
  }
  for i, tbl := range tables {
    tables[i] = pq.QuoteIdentifier(tbl)
  }
  q := fmt.Sprintf("TRUNCATE %s CASCADE", strings.Join(tables, ", "))
  fmt.Println(q)

  if _, err := pg.Query(q); err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't clear postgres before migrating: %s", err.Error())
    os.Exit(1)
  }
}
