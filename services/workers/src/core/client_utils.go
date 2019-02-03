package core

import (
  "net/http"
)

func copyHeaders(dst, src http.Header) {
  for k, vv := range src {
    for _, v := range vv {
      dst.Add(k, v)
    }
  }
}

func parseClientExtras(args ...interface{}) (fakeAgent bool) {
  fakeAgent = false

  for i,p := range args {
    switch i {
    case 0:
      param, ok := p.(bool)
      if !ok {
        return
      }
      fakeAgent = param

    default:
      return
    }
  }

  return
}