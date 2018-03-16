package galicia2

import (
  "strings"
)

const (
  colOpen = "<td"
  colClose = "</td>"
  colCloseLen = len(colClose)
)

func splitColumns(data []byte, atEOF bool) (advance int, token []byte, err error) {
  // Return nothing if at end of file and no data passed
  if atEOF && len(data) == 0 {
    return 0, nil, nil
  }

  dataStr := string(data)
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
    return end + colCloseLen, data[openTagEnd+1:end], nil
  }

  return

}
