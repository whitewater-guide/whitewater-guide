package main

import (
  "unicode"
  "github.com/lib/pq"
  "database/sql/driver"
  "github.com/lunny/html2md"
  "github.com/globalsign/mgo/bson"
  "fmt"
  "github.com/jmoiron/sqlx"
)

type IdMap map[bson.ObjectId]string

// ToSnake convert the given string to snake case following the Golang format:
// acronyms are converted to lower-case and preceded by an underscore.
func ToSnake(in string) string {
  runes := []rune(in)
  length := len(runes)

  var out []rune
  for i := 0; i < length; i++ {
    if i > 0 && unicode.IsUpper(runes[i]) && ((i+1 < length && unicode.IsLower(runes[i+1])) || unicode.IsLower(runes[i-1])) {
      out = append(out, '_')
    }
    out = append(out, unicode.ToLower(runes[i]))
  }

  return string(out)
}

type SeasonNumeric pq.Int64Array

func (a SeasonNumeric) Value() (driver.Value, error) {
  if a == nil {
    return "{}", nil
  }

  return (pq.Int64Array(a)).Value()
}

type HtmlString string

func (str HtmlString) Value() (driver.Value, error) {
  return html2md.Convert(string(str)), nil
}

func fillJunction(pg *sqlx.DB, table, one, many string, idMap *IdMap, oneId string, manyIds []bson.ObjectId) error {
  tx, err := pg.Begin()
  if err != nil {
    return fmt.Errorf("couldn't obtain %s(%s, %s) transaction: %s", table, one, many, err.Error())
  }

  rpStmt, err := tx.Prepare(pq.CopyIn(table, one, many))
  if err != nil {
    return fmt.Errorf("couldn't prepare %s(%s, %s) copy statement: %s", table, one, many, err.Error())
  }

  for i := range manyIds {
    _, err = rpStmt.Exec(oneId, (*idMap)[manyIds[i]])
    if err != nil {
      return fmt.Errorf("couldn't exec copy statement for table %s(%s, %s): %s", table, one, many, err.Error())
    }
  }

  _, err = rpStmt.Exec()
  if err != nil {
    return fmt.Errorf("couldn't finalize copy statement for table %s(%s, %s): %s", table, one, many, err.Error())
  }

  err = rpStmt.Close()
  if err != nil {
    return fmt.Errorf("couldn't close copy statement for table %s(%s, %s): %s", table, one, many, err.Error())
  }

  err = tx.Commit()
  if err != nil {
    return fmt.Errorf("couldn't commit %s(%s, %s) transaction: %s", table, one, many, err.Error())
  }
  return nil
}
