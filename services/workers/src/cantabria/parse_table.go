package cantabria

import (
  "bufio"
  "core"
  "strconv"
  "strings"
  "time"
)

const href = "<a target=\"_blank\" href=\"https://www.chcantabrico.es/web/chcmovil/evolucion-de-niveles?cod_estacion="
const hrefLen = len(href)
const valor1 = "<span class=\"texto_verde\">"
const valor2 = "</span>"

func parseTable(script string) ([]core.GaugeInfo, error) {
  var result []core.GaugeInfo
  location, err := time.LoadLocation("CET")
  if err != nil {
    return result, err
  }
  resp, err := core.Client.Get("https://www.chcantabrico.es/web/chcmovil/tabla-resumen-niveles-")
  if err != nil {
    return result, err
  }
  defer resp.Body.Close()

  scanner := bufio.NewScanner(resp.Body)
  scanner.Split(splitTable)

  ind := -1
  var fecha, hora string
  var timestamp time.Time
  var tdStack []string
  for scanner.Scan() {
    ind += 1
    text := scanner.Text()
    if ind == 0 {
      fecha = strings.TrimSpace(text)
      continue
    } else if ind == 1 {
      hora = strings.TrimSpace(text)
      timestamp, err = time.ParseInLocation("02-01-2006 15:04", fecha+" "+hora, location)
      if err != nil {
        return result, err
      }
      continue
    }
    tdStack = append(tdStack, text)
    hrefInd := strings.Index(text, href)
    if hrefInd != -1 {
      code := text[hrefInd+hrefLen : hrefInd+hrefLen+4]
      valorText := tdStack[len(tdStack)-3]
      valorInd := strings.Index(valorText, valor1) + len(valor1)
      valorEnd := strings.Index(valorText, valor2)
      valor, _ := strconv.ParseFloat(valorText[valorInd:valorEnd], 64)
      station := strings.TrimSpace(tdStack[len(tdStack)-4])
      river := strings.TrimSpace(tdStack[len(tdStack)-5])
      gauge := core.GaugeInfo{
        GaugeId: core.GaugeId{
          Code:   code,
          Script: script,
        },
        Name:      river + " - " + station,
        Url:       "https://www.chcantabrico.es/sistema-automatico-de-informacion-detalle-estacion?cod_estacion=" + code,
        LevelUnit: "m",
        Measurement: core.Measurement{
          GaugeId: core.GaugeId{
            Code:   code,
            Script: script,
          },
          Level:     valor,
          Timestamp: core.HTime{Time: timestamp},
        },
      }
      result = append(result, gauge)
      tdStack = make([]string, 0)
    }
  }
  if err := scanner.Err(); err != nil {
    return result, err
  }
  return result, nil
}
