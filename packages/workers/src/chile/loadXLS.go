package chile

import (
  "net/url"
    "time"
  "core"
)

const xlsUrl = "http://dgasatel.mop.cl/cons_det_instan_xls.asp"

func loadXLS(code string, since int64) (string, error) {
  tz, err := time.LoadLocation("America/Santiago")
  if err != nil {
    return "", nil
  }
  period := "1d"
  if since == 0 {
    period = "3m"
  }
  t := time.Now().In(tz)
  core.Client.EnsureCookie("http://dgasatel.mop.cl", "http://dgasatel.mop.cl")
  html, err := core.Client.PostFormAsString(xlsUrl, url.Values{
    "accion":         {"refresca"},
    "chk_estacion1a": {code + "_1", code + "_12"},
    "chk_estacion1b": {""},
    "chk_estacion2a": {""},
    "chk_estacion2b": {""},
    "chk_estacion3a": {""},
    "chk_estacion3b": {""},
    "estacion1":      {code},
    "estacion2":      {"-1"},
    "estacion3":      {"-1"},
    "fecha_fin":      {t.Format("02/01/2006")},
    "fecha_finP":     {t.Format("02/01/2006")},
    "fecha_ini":      {t.Format("02/01/2006")},
    "period":         {period},
    "tiporep":        {"I"},
  })
  return html, err
}
