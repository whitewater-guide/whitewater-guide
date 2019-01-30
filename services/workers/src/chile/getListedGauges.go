package chile

import (
  "strings"
  "bufio"
  "core"
)

const (
  listPageUrl = "http://dgasatel.mop.cl/filtro_paramxestac_new2.asp"
  //listPageUrl    = "https://gist.githubusercontent.com/doomsower/8d32132a598ce39eebcb6f7ceb704a34/raw/86a983f1091e46c06860beed642a43ad9f3a067c/chile_gauges_list.html"
  optionsStart   = "<select name=\"estacion1\""
  optionsEnd     = "</select>"
  optionStart    = "<option value="
  optionEnd      = "</option>"
  optionStartLen = len(optionStart)
  optionEndLen   = len(optionEnd)
)

func splitOptions(data []byte, atEOF bool) (advance int, token []byte, err error) {
  // Return nothing if at end of file and no data passed
  if atEOF && len(data) == 0 {
    return 0, nil, nil
  }

  dataStr := string(data)
  if start := strings.Index(dataStr, optionStart); start >= 0 {
    end := strings.Index(dataStr[start:], optionEnd)
    if end <= 0 {
      return
    }
    return end + start + optionEndLen, data[start+optionStartLen : start+end], nil
  }

  return
}

func parseOption(opt string) (id string, name string) {
  valAndRest := strings.Split(opt, ">")
  id = valAndRest[0]
  rest := strings.Join(valAndRest[1:], " ")
  valAndRest = strings.Split(rest, " ")
  name = strings.TrimSpace(strings.Join(valAndRest[1:], " "))
  return
}

/**
 * Parse dropdown select options and get gauge ids
 * Returns map where gauge id is the key and gauge name is the value
 */
func getListedGauges() (map[string]string, error) {
  html, err := core.Client.GetAsString(listPageUrl)
  if err != nil {
    return nil, err
  }
  optionsStartIndex := strings.Index(html, optionsStart)
  optionsEndIndex := strings.Index(html, optionsEnd) + len(optionsEnd)
  html = html[optionsStartIndex:optionsEndIndex]

  scanner := bufio.NewScanner(strings.NewReader(html))
  scanner.Split(splitOptions)
  result := make(map[string]string)
  for scanner.Scan() {
    value := scanner.Text()
    id, name := parseOption(value)
    if id != "\"-1\"" {
      result[id] = name
    }
  }

  return result, nil
}
