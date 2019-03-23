package cantabria

import (
  "bufio"
  "core"
  "strconv"
  "strings"
)

const preLen = len("var myCenter=new google.maps.LatLng(")
const postLen = len(");\n")

// http://saih.chminosil.es/index.php?url=/datos/ficha/estacion:N015
func parseGaugeLocation(code string) (latitude float64, longitude float64) {
  resp, err := core.Client.Get("https://www.chcantabrico.es/sistema-automatico-de-informacion-detalle-estacion?cod_estacion=" + code)
  if err != nil {
    return
  }
  defer resp.Body.Close()
  scanner := bufio.NewScanner(resp.Body)
  for scanner.Scan() {
    line := scanner.Text()
    if strings.Index(line, "var myCenter") >= 0 {
      latLng := strings.Split(line[preLen+2:len(line)-postLen+1], ", ")
      latitude, _ = strconv.ParseFloat(latLng[0], 64)
      longitude, _ = strconv.ParseFloat(latLng[1], 64)
      return
    }
  }
  return
}
