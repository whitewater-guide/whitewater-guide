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
  "os"
  "fmt"
)

var endpoint = "/endpoint"

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

func handlerRecover(logger *log.Entry, res *http.ResponseWriter) {
  if err := recover(); err != nil {
    errStr := fmt.Sprintf("%v", err)
    logger.WithFields(log.Fields{
      "error": errStr,
    }).Error("failed to handle request")
    sendFailure(*res, fmt.Errorf(errStr))
  }
}

func list() []core.Description {
  result := make([]core.Description, len(workerFactories))
  i := 0
  for _, factory := range workerFactories {
    worker := factory()
    result[i] = core.Description{Name: worker.ScriptName(), Mode: worker.HarvestMode()}
    i++
  }
  return result
}

func handler(res http.ResponseWriter, req *http.Request) {
  res.Header().Set("Content-Type", "application/json")
  var respBody *core.Response

  var payload Payload
  if err := getPayload(req, &payload); err != nil {
    sendFailure(res, err)
    return
  }

  var result interface{}
  harvestOptions := payload.HarvestOptions

  logger := *log.WithFields(structs.Map(payload))
  logger = *logger.WithFields(structs.Map(harvestOptions))
  defer handlerRecover(&logger, &res)

  var count int
  var err error
  switch payload.Command {
  case "list":
    descrs := list()
    result, count = descrs, len(descrs)
  case "autofill":
    worker := workerFactories[payload.Script]()
    var gauges []core.GaugeInfo
    gauges, err = worker.Autofill()
    result, count = gauges, len(gauges)
  case "harvest":
    worker := workerFactories[payload.Script]()
    var measurements []core.Measurement
    measurements, err = harvest(worker, payload)
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

  go saveOpLog(payload.Script, payload.Code, err, count)

  encoder := json.NewEncoder(res)
  if err = encoder.Encode(respBody); err != nil {
    logger.Error("failed to encode result")
  }
}

func main() {
  logLevelStr := os.Getenv("WORKERS_LOG_LEVEL")
  if logLevelStr == "" {
    logLevelStr = "debug"
  }
  lvl, err := log.ParseLevel(logLevelStr)
  if err != nil {
    lvl = log.DebugLevel
  }
  log.SetLevel(lvl)

  log.Info("staring workers")

  register(galicia.NewWorkerGalicia)
  register(galicia2.NewWorkerGalicia2)
  register(georgia.NewWorkerGeorgia)
  register(norway.NewWorkerNorway)
  register(all_at_once.NewWorkerAllAtOnce)
  register(one_by_one.NewWorkerOneByOne)
  http.HandleFunc("/", handler)

  var port = os.Getenv("WORKERS_PORT")
  if port == "" {
    port = "7080"
  }
  var ep = os.Getenv("WORKERS_ENDPOINT")
  if ep != "" {
    endpoint = ep
  }

  initRedis()

  log.WithFields(log.Fields{
    "port": port,
    "endpoint": endpoint,
  }).Info("workers are listening")

  log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
