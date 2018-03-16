package main

import (
  "net/http"
  "encoding/json"
  "core"
  "galicia"
  log "github.com/sirupsen/logrus"
  "github.com/fatih/structs"
  "galicia2"
  "georgia"
  "norway"
  "all-at-once"
  "one-by-one"
)

type Payload struct {
  Command string      `json:"command" structs:"command"`
  Script  string      `json:"script" structs:"script,omitempty"`
  core.HarvestOptions `json:",inline" structs:"-"`
}

var workerFactories = make(map[string]core.WorkerFactory)

func register(factory core.WorkerFactory) {
  worker := factory()
  workerFactories[worker.ScriptName()] = factory
}

func handlerRecover(logger *log.Entry) {
  if err := recover(); err != nil {
    logger.WithFields(log.Fields{
      "error": err,
    }).Error("failed to handle request")
  }
}

func handler(res http.ResponseWriter, req *http.Request) {
  res.Header().Set("Content-Type", "application/json")
  var respBody *core.Response
  var earlyError string

  if req.URL.Path != "/endpoint" {
    res.WriteHeader(http.StatusBadRequest)
    earlyError = "wrong endpoint path " + req.URL.Path
  }
  if req.Method != "POST" {
    res.WriteHeader(http.StatusBadRequest)
    earlyError = "only POST is supported"
  }

  var payload Payload
  decoder := json.NewDecoder(req.Body)
  if err := decoder.Decode(&payload); err != nil {
    res.WriteHeader(http.StatusBadRequest)
    earlyError = "failed to parse request body"
  }

  if earlyError != "" {
    log.Error(earlyError)
    encoder := json.NewEncoder(res)
    respBody := core.Response{
      Success: false,
      Error:   earlyError,
    }
    if err := encoder.Encode(respBody); err != nil {
      log.Error("failed to encode result")
    }
    return
  }

  var result interface{}
  harvestOptions := payload.HarvestOptions

  logger := *log.WithFields(structs.Map(payload))
  logger = *logger.WithFields(structs.Map(harvestOptions))
  defer handlerRecover(&logger)

  worker := workerFactories[payload.Script]()

  var count int
  var err error
  switch payload.Command {
  case "describe":
    result = core.Description{Name: worker.ScriptName(), Mode: worker.HarvestMode()}
  case "autofill":
    var gauges []core.GaugeInfo
    gauges, err = worker.Autofill()
    result, count = gauges, len(gauges)
  case "harvest":
    var measurements []core.Measurement
    measurements, err = worker.Harvest(harvestOptions)
    measurements = core.FilterMeasurements(measurements, payload.Since)
    result, count = measurements, len(measurements)
  default:
    logger.Error("bad command")
    return
  }

  if err != nil {
    respBody = &core.Response{Success: false, Error: err.Error()}
    logger.WithFields(log.Fields{"error": err}).Error("worker failed")
  } else {
    respBody = &core.Response{Success: true, Data: result}
    logger.WithFields(log.Fields{"count": count}).Info("success")
  }

  encoder := json.NewEncoder(res)
  if err = encoder.Encode(respBody); err != nil {
    logger.Error("failed to encode result")
  }
}

func main() {
  register(galicia.NewWorkerGalicia)
  register(galicia2.NewWorkerGalicia2)
  register(georgia.NewWorkerGeorgia)
  register(norway.NewWorkerNorway)
  register(all_at_once.NewWorkerAllAtOnce)
  register(one_by_one.NewWorkerOneByOne)
  http.HandleFunc("/", handler)
  log.Fatal(http.ListenAndServe(":7080", nil))
}
