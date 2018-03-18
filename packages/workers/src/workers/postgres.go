package main

import (
  _ "github.com/lib/pq"
  "github.com/jmoiron/sqlx"
  "os"
  "fmt"
  "github.com/sirupsen/logrus"
  "core"
)

var pg *sqlx.DB

func initPg()  {
  pgConnStr := fmt.Sprintf(
    "postgres://postgres:%s@%s/%s?sslmode=disable",
    os.Getenv("PGPASSWORD"),
    os.Getenv("POSTGRES_HOST"),
    os.Getenv("POSTGRES_DB"),
  )
  pg, err := sqlx.Connect("postgres", pgConnStr)
  if err != nil {
    logrus.WithFields(logrus.Fields{
      "pgConnStr": pgConnStr,
    }).Fatal("failed to init postgres")
  }
  fmt.Println(pg)
}

func saveMeasurements(measurements []core.Measurement) (int, error) {
  query := "INSERT INTO measurements (timestamp, script, code, flow, level) VALUES"
  count := 0
  for _, m := range measurements {
    // Omit bad measurements (galicia sometimes send negative values)
    if m.Flow < 0 || m.Level < 0 || (m.Flow == 0.0 && m.Level == 0.0) {
      continue
    }
    count++
    query = query + fmt.Sprintf(" (%s, %s, %s, %f, %f),", m.Timestamp, m.Script, m.Code, m.Flow, m.Level)
  }
  if count == 0 {
    return 0, nil
  }
  query = query[:len(query)-1] + " ON CONFLICT DO NOTHING"
  result, err := pg.Exec(query)
  if err != nil {
    return 0, err
  }
  if rowsAffected, err := result.RowsAffected(); err == nil {
    return int(rowsAffected), nil
  } else {
    return count, nil
  }
}