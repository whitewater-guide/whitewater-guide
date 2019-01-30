package chile

import (
  "strings"
  "fmt"
  "golang.org/x/net/html"
  "core"
  "strconv"
  "time"
)

type ColumnIndices struct {
  timestamp int
  flow      int
  level     int
}

func newIndices() ColumnIndices {
  return ColumnIndices{-1, -1, -1,}
}

func badIndices(ind ColumnIndices) bool {
  return ind.timestamp < 0 || ind.flow < 0 || ind.level < 0
}

/**
 * Takes raw xls file content and extracts strings that is html table with needed data
 */
func extractDataTable(raw string) (string, error) {
  startComment := "<!-- tabla para resultados numerados -->"
  endComment := "<!-- tabla con pixel gif transparente"
  startIndex := strings.Index(raw, startComment)
  if startIndex == -1 {
    return "", fmt.Errorf("cannot find tabla para resultados numerados")
  }
  rest := raw[startIndex+len(startComment):]
  endIndex := strings.Index(rest, endComment)
  if endIndex == -1 {
    return "", fmt.Errorf("cannot find end of tabla para resultados numerados")
  }
  return strings.TrimSpace(rest[:endIndex]), nil
}

func findColumnIndices(header *html.Node) (ind ColumnIndices) {
  ind = newIndices()
  for i, c := 0, header.FirstChild; c != nil; c = c.NextSibling {
    if c.Type != html.ElementNode && c.Data != "th" {
      continue
    }
    var thTxt strings.Builder
    html.Render(&thTxt, c)
    if strings.Index(thTxt.String(), "Fecha-Hora") >= 0 {
      ind.timestamp = i
    }
    if strings.Index(thTxt.String(), "AltLM") >= 0 {
      ind.level = i
    }
    if strings.Index(thTxt.String(), "Caudal") >= 0 {
      ind.flow = i
    }
    i++
  }
  return
}

func findTableHeaderRow(node *html.Node) *html.Node {
  if node.Type == html.ElementNode && node.Data == "tr" && len(node.Attr) == 1 && node.Attr[0].Key == "bgcolor" && node.Attr[0].Val == "D5E1F4" {
    return node
  }
  for c := node.FirstChild; c != nil; c = c.NextSibling {
    found := findTableHeaderRow(c)
    if found != nil {
      return found
    }
  }
  return nil
}

func parseDataRow(tr *html.Node, ind ColumnIndices, tz *time.Location) (result core.Measurement, err error) {
  for i, c := 0, tr.FirstChild; c != nil; c = c.NextSibling {
    if c.Type != html.ElementNode || c.Data != "td" {
      continue
    }
    if i == ind.timestamp {
      if c.FirstChild == nil {
        err = fmt.Errorf("cannot find first child for timestamp")
        return
      }
      timeStr := c.FirstChild.Data
      var t time.Time
      t, err = time.ParseInLocation("02/01/2006 15:04", timeStr, tz)
      if err != nil {
        return
      }
      result.Timestamp = core.HTime{t.UTC()}
    }
    if i == ind.flow {
      if c.FirstChild == nil {
        err = fmt.Errorf("cannot find first child for flow")
        return
      }
      flowStr := c.FirstChild.Data
      result.Flow, err = strconv.ParseFloat(flowStr, 64)
      if err != nil {
        return
      }
    }
    if i == ind.level {
      if c.FirstChild == nil {
        err = fmt.Errorf("cannot find first child for level")
        return
      }
      levelStr := c.FirstChild.Data
      result.Level, err = strconv.ParseFloat(levelStr, 64)
      if err != nil {
        return
      }
    }
    i++
  }
  return
}

func parseXLS(rawDoc, script, code string) (result []core.Measurement, err error) {
  tableStr, err := extractDataTable(rawDoc)
  if err != nil {
    return
  }
  doc, err := html.Parse(strings.NewReader(tableStr))
  if err != nil {
    return
  }
  header := findTableHeaderRow(doc)
  if header == nil {
    err = fmt.Errorf("cannot find data table header")
    return
  }
  indices := findColumnIndices(header)
  if badIndices(indices) {
    err = fmt.Errorf("could not find flow or level column")
    return
  }
  thead := header.Parent
  tbody := thead.NextSibling
  for tbody.Type != html.ElementNode || tbody.Data != "tbody" {
    tbody = tbody.NextSibling
  }
  // tbody contains rows with actual data
  result = make([]core.Measurement, 0)
  santiago, err := time.LoadLocation("America/Santiago")
  if err != nil {
    return
  }
  for c := tbody.FirstChild; c != nil; c = c.NextSibling {
    if c.Type == html.ElementNode && c.Data == "tr" {
      var m core.Measurement
      m, err = parseDataRow(c, indices, santiago)
      m.Script = script
      m.Code = code
      if err == nil {
        result = append(result, m)
      }
      //else {
      //  log.Println("warning", script, code, err)
      //}
    }
  }
  return
}
