package ecuador

import (
  "core"
  "encoding/json"
  "strings"
)

const LIST2 = "http://186.42.174.236/InamhiEmas/json.php?callback="

func parseList2(script string) ([]core.GaugeInfo, error) {
  raw, err := fetch(LIST2)
  if err != nil {
    return nil, err
  }
  var items []InamhiEmasItem

  err = json.Unmarshal(raw[2:len(raw)-1], &items) // cut JSONP brackets
  if err != nil {
    return nil, err
  }

  var result []core.GaugeInfo
  for _, item := range items {
    if item.Category != "HIDROLOGICA" {
     continue
    }
    result = append(result, core.GaugeInfo{
      GaugeId: core.GaugeId{
        Script: script,
        Code:   item.Code,
      },
      Name: strings.Title(strings.ToLower(item.Name)),
      Location: core.Location{
        Latitude:  item.Lat,
        Longitude: item.Lng,
        Altitude:  item.Alt,
      },
      LevelUnit: "m",
    })
  }

  return result, nil

}
