package chile

import (
  "net/url"
  "time"
  "core"
  "strings"
  log "github.com/sirupsen/logrus"
  "github.com/moul/http2curl"
  "encoding/base64"
)

const xlsUrl = "http://dgasatel.mop.cl/cons_det_instan_xls.asp"

func loadXLS(code string, since int64, retry bool) (string, error) {
  tz, err := time.LoadLocation("America/Santiago")
  if err != nil {
    return "", nil
  }
  period := "1d"
  if since == 0 {
    period = "3m"
  }
  t := time.Now().In(tz)
  cookieErr := core.Client.EnsureCookie("http://dgasatel.mop.cl", "http://dgasatel.mop.cl", !retry)
  values := url.Values{
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
  }
  html, req, err := core.Client.PostFormAsString(xlsUrl, values)

  if strings.Index(html, "tabla para resultados numerados") == -1 {
    if retry {
      return loadXLS(code, since, false)
    }
    curl, _ := http2curl.GetCurlCommand(req)
    encoded := base64.StdEncoding.EncodeToString([]byte(curl.String()))
    log.WithFields(log.Fields{
      "code":      code,
      "since":     since,
      "cookieErr": cookieErr != nil,
      "req":       encoded,
      "values":    values.Encode(),
    }).Warn("missing data table in XLS response")
  }

  return html, err
}
