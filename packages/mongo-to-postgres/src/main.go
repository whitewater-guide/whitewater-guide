package main

import (
  "github.com/globalsign/mgo"
  "os"
  "fmt"
  _ "github.com/lib/pq"
  "strings"
  "github.com/lib/pq"
  "github.com/jmoiron/sqlx"
  "time"
  "flag"
  "net"
  "github.com/fsnotify/fsnotify"
)

func main() {
  // Flag -watch makes app wait until mongorestore container done its job
  var waitFor = flag.String("watch", "", "Set to true to wait for mongorestore container to finish")
  flag.Parse()

  if *waitFor != "" {
    waitUntilRestored(*waitFor)
  }
  migrate()
}

// Mongorestore finishes by deleting downloaded archive, wait for file deletion event
func waitUntilRestored(mongorestoreDir string) {
  watcher, err := fsnotify.NewWatcher()
  backupFile := os.Getenv("BACKUP_NAME")
  if err != nil {
    fmt.Printf("Failed to start file watcher: %s", err.Error())
    os.Exit(1)
  }
  defer watcher.Close()

  done := make(chan bool)
  go func() {
    for {
      event := <-watcher.Events
      if event.Op&fsnotify.Remove == fsnotify.Remove {
        if strings.Contains(event.Name, backupFile) {
          fmt.Println("Removed backup archive")
          done <- true
        }
      }
    }
  }()

  err = watcher.Add(mongorestoreDir)
  if err != nil {
    fmt.Printf("Failed to add watch dir: %s", err.Error())
    os.Exit(1)
  }
  <-done
  watcher.Close()
  fmt.Println("Closed watcher")
}

func migrate()  {
  start := time.Now()
  // ---- Prepare Mongo and PG
  mongo := getMongo(1, 60)
  pg := getPostgres(1, 60)
  // ----- Clear all tables

  clearPg(pg)

  elapsed := time.Since(start)
  fmt.Printf("Preparation took %s\n", elapsed)
  start = time.Now()

  // ----- Begin migration

  // Mapping between Mongo Ids (they are not Mongo.ObjectIds btw, they are 17bytes generated by Meteor)
  uuids := IdMap{}
  // Mapping between source's Mongo Ids and Scripts
  scripts := IdMap{}
  // Mapping Gauge Mongo Id <--> { Script, Code }
  mKeys := make(GaugesToKeys)

  if err := insertTags(mongo, pg, uuids); err != nil {
    fmt.Printf("Error while inserting tags: %s\n", err.Error())
    os.Exit(1)
  }


  if err := insertUsers(mongo, pg, uuids); err != nil {
    fmt.Printf("Error while inserting users: %s\n", err.Error())
    os.Exit(1)
  }

  if err := insertPoints(mongo, pg, uuids); err != nil {
    fmt.Printf("Error while inserting points: %s\n", err.Error())
    os.Exit(1)
  }

  if err := insertRegions(mongo, pg, uuids); err != nil {
    fmt.Printf("Error while inserting regions: %s\n", err.Error())
    os.Exit(1)
  }

  if err := insertSources(mongo, pg, uuids, scripts); err != nil {
    fmt.Printf("Error while inserting regions: %s\n", err.Error())
    os.Exit(1)
  }

  if err := insertGauges(mongo, pg, uuids, scripts, mKeys); err != nil {
    fmt.Printf("Error while inserting gauges: %s\n", err.Error())
    os.Exit(1)
  }

  if err := insertRivers(mongo, pg, uuids); err != nil {
    fmt.Printf("Error while inserting rivers: %s\n", err.Error())
    os.Exit(1)
  }

  if err := insertMedia(mongo, pg, uuids); err != nil {
    fmt.Printf("Error while inserting media: %s\n", err.Error())
    os.Exit(1)
  }


  if err := insertSections(mongo, pg, uuids); err != nil {
    fmt.Printf("Error while inserting sections: %s\n", err.Error())
    os.Exit(1)
  }

  elapsed = time.Since(start)
  fmt.Printf("Inserted %d objects in %s\n", len(uuids), elapsed)
  start = time.Now()

  // ----- Measurements
  mCount, err := insertMeasurements(mongo, pg, mKeys)
  if err != nil {
    fmt.Printf("Error while inserting measurements: %s\n", err.Error())
    os.Exit(1)
  }

  elapsed = time.Since(start)
  fmt.Printf("Migrated %d measurements in %s\n", mCount, elapsed)
  os.Exit(0)
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

  if _, err := pg.Query(q); err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't clear postgres before migrating: %s", err.Error())
    os.Exit(1)
  }
}

func getMongo(timeout, retries int64) *mgo.Database {
  mongoUri := os.Getenv("MONGO_URI")
  session, err := mgo.Dial(mongoUri)
  if err != nil {
    if retries > 0 {
      time.Sleep(time.Duration(timeout) * time.Second)
      return getMongo(timeout, retries-1)
    } else {
      fmt.Printf("Couldn't wait for mongo anymore, %s", err.Error())
      os.Exit(1)
    }
  }
  return session.DB("wwdb")
}

func getPostgres(timeout, retries int64) *sqlx.DB {

  pgConnStr := fmt.Sprintf(
    "postgres://postgres:%s@%s/%s?sslmode=disable",
    os.Getenv("PGPASSWORD"),
    os.Getenv("POSTGRES_HOST"),
    os.Getenv("POSTGRES_DB"),
  )
  pg, err := sqlx.Open("postgres", pgConnStr)

  if err != nil {
    if retries > 0 {
      time.Sleep(time.Duration(timeout) * time.Second)
      return getPostgres(timeout, retries-1)
    } else {
      fmt.Printf("Couldn't wait for mongo anymore, %s", err.Error())
      os.Exit(1)
    }
  }

  pg.MapperFunc(ToSnake)
  return pg
}

func waitForStartSignal(conn net.Conn) {

}
