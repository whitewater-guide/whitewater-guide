package main

import (
  "encoding/json"
  "core"
  "net/http"
  log "github.com/sirupsen/logrus"
  "fmt"
)

func getPayload(req *http.Request, payload *Payload) error {
  var earlyError string

  if req.URL.Path != endpoint {
    earlyError = "wrong endpoint path " + req.URL.Path
  }
  if req.Method != "POST" {
    earlyError = "only POST is supported"
  }

  decoder := json.NewDecoder(req.Body)
  if err := decoder.Decode(payload); err != nil {
    earlyError = "failed to parse request body"
  }

  if earlyError != "" {
    log.Error(earlyError)
    return fmt.Errorf(earlyError)
  }

  return nil
}

func sendFailure(res http.ResponseWriter, err error) {
  res.WriteHeader(http.StatusBadRequest)
  encoder := json.NewEncoder(res)
  respBody := core.Response{
    Success: false,
    Error:   err.Error(),
  }
  if err := encoder.Encode(respBody); err != nil {
    log.Error("failed to encode result")
  }
}
