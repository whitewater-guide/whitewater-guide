package main

import (
  _ "github.com/lib/pq"
  "github.com/jmoiron/sqlx"
  "os"
  "fmt"
  "github.com/sirupsen/logrus"
  "core"
  "time"
)

var pg *sqlx.DB

func initPg()  {
  pgHost := os.Getenv("POSTGRES_HOST")
  if pgHost == "" {
    pgHost = "db"
  }
  pgConnStr := fmt.Sprintf(
    "postgres://postgres:%s@%s/%s?sslmode=disable",
    os.Getenv("POSTGRES_PASSWORD"),
    pgHost,
    os.Getenv("POSTGRES_DB"),
  )
  var err error
  pg, err = getPostgres(pgConnStr, 2, 60)
  if err != nil {
    logrus.WithFields(logrus.Fields{
      "pgConnStr": pgConnStr,
    }).Fatal("failed to init postgres")
  }
}

/**
 * Because containers start in random order, this function waits for postgres to start
 */
func getPostgres(pgConnStr string, timeout, retries int64) (*sqlx.DB, error) {
  pg, err := sqlx.Connect("postgres", pgConnStr)

  if err != nil {
    if retries > 0 {
      time.Sleep(time.Duration(timeout) * time.Second)
      return getPostgres(pgConnStr, timeout, retries-1)
    } else {
      return nil, fmt.Errorf("couldn't wait for mongo anymore, %s", err)
    }
  }

  //pg.MapperFunc(ToSnake)
  return pg, nil
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
    query = query + fmt.Sprintf(" ('%s', '%s', '%s', %f, %f),", m.Timestamp.Format(time.RFC3339), m.Script, m.Code, m.Flow, m.Level)
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