package ecuador

import (
  "core"
  "regexp"
  "strings"
)

const LIST_URL = "http://186.42.174.243:9090/RTMCProject.js.jgz"

func parseList(script string) ([]core.GaugeInfo, error) {
  raw, err := fetch(LIST_URL)
  if err != nil {
    return nil, err
  }
  r := regexp.MustCompile(`"(.*)\s(H\d{4})";`)
  matches := r.FindAllStringSubmatch(string(raw), -1)
  var result []core.GaugeInfo
  for _, m := range matches {
    name := strings.Title(strings.ToLower(m[1]))
    code := m[2]
    if code != "" {
      gauge := core.GaugeInfo{
        GaugeId: core.GaugeId{
          Code:   code,
          Script: script,
        },
        LevelUnit: "m",
        Name:      name,
      }
      result = append(result, gauge)
    }
  }

  return result, nil
}