package main

import (
  "github.com/globalsign/mgo"
  "os"
  "fmt"
  _ "github.com/lib/pq"
  "database/sql"
  "strings"
  "github.com/lib/pq"
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
  pg, err := sql.Open("postgres", pgConnStr)
  if err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't connect to postgres: %s", err.Error())
    os.Exit(1)
  }

  clearPg(pg)

  tags := insertTags(mongo, pg)
  users := insertUsers(mongo, pg)

  fmt.Printf("Inserted %d tags\n", len(tags))
  fmt.Printf("Inserted %d users\n", len(users))
}

func clearPg(pg *sql.DB) {
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
