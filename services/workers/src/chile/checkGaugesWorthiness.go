package chile

import (
  "fmt"
  "net/url"
  "time"
  "strings"
  "core"
)

const checkURL = "http://dgasatel.mop.cl/filtro_paramxestac_new2.asp"

func checkGaugesWorthiness(ids []string, data map[string]bool) error {
  if len(ids) > 3 {
    return fmt.Errorf("no more than 3 ids at a time allowed, but received %d", len(ids))
  }
  estacion1 := ids[0]
  if estacion1 == "" {
    estacion1 = "-1"
  }
  estacion2 := ids[1]
  if estacion2 == "" {
    estacion2 = "-1"
  }
  estacion3 := ids[2]
  if estacion3 == "" {
    estacion3 = "-1"
  }
  tz, err := time.LoadLocation("America/Santiago")
  if err != nil {
    return err
  }
  t := time.Now().In(tz)
  html, _, err := core.Client.PostFormAsString(checkURL, url.Values{
    "accion":     {"refresca"},
    "EsDL1":      {"0"},
    "EsDL2":      {"0"},
    "EsDL3":      {"0"},
    "estacion1":  {estacion1},
    "estacion2":  {estacion2},
    "estacion3":  {estacion3},
    "fecha_fin":  {t.Format("02/01/2006")},
    "fecha_finP": {t.Format("02/01/2006")},
    "fecha_ini":  {t.Format("02/01/2006")},
    "hora_fin":   {"0"},
    "tipo":       {"ANO"},
    "UserID":     {"nobody"},
  })
  if err != nil {
    return err
  }

  if !strings.Contains(html, "DATOS EN TABLAS") {
    time.Sleep(10 * time.Second)
    return checkGaugesWorthiness(ids, data)
  }

  // append "_1" to gauge id => value of "Nivel de agua" checkbox (level)
  // append "_12" to gauge id => value of "Caudal" checkbox (flow)
  for _, id := range ids {
    if id == "" {
      continue
    }
    data[id] = strings.Contains(html, id+"_1>") || strings.Contains(html, id+"_12>")
  }

  return nil
}
