package cantabria

import (
  "strings"
)

const (
  colOpen     = "<td"
  colClose    = "</td>"
  colCloseLen = len(colClose)
  calendar1   = "<img src=\"/o/TablasResumen/images/calendario.png\" title=\"fecha\" alt=\"fecha\">"
  calendar2   = "<img src=\"/o/TablasResumen/images/hora.png\" title=\"hora\" alt=\"hora\">"
  calendar3   = "</div>"
)

// First two tokens returned are date and time, next tokens are td contents
func splitTable(data []byte, atEOF bool) (advance int, token []byte, err error) {
  // Return nothing if at end of file and no data passed
  if atEOF && len(data) == 0 {
    return 0, nil, nil
  }

  dataStr := string(data)

  if start := strings.Index(dataStr, calendar1); start >= 0 {
    end := strings.Index(dataStr[start:], calendar2)
    if end <= 0 {
      return
    }
    end += start
    return end, data[start+len(calendar1)+1 : end], nil
  }

  if start := strings.Index(dataStr, calendar2); start >= 0 {
    end := strings.Index(dataStr[start:], calendar3)
    if end <= 0 {
      return
    }
    end += start
    return end + len(calendar3), data[start+len(calendar2)+1 : end], nil
  }

  if start := strings.Index(dataStr, colOpen); start >= 0 {
    openTagEnd := strings.Index(dataStr[start:], ">")
    if openTagEnd <= 0 {
      return
    }
    openTagEnd += start
    end := strings.Index(dataStr[start:], colClose)
    //fmt.Println(start, end)
    if end <= 0 {
      return
    }
    end += start
    return end + colCloseLen, data[openTagEnd+1 : end], nil
  }

  return

}
