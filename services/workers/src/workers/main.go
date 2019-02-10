package main

import (
	"all-at-once"
	"chile"
	"core"
	"ecuador"
	"flag"
	"fmt"
	"galicia"
	"galicia2"
	"georgia"
	"github.com/fatih/structs"
	log "github.com/sirupsen/logrus"
	"logging"
	"net/http"
	"norway"
	"one-by-one"
	"os"
	"riverzone"
	"switzerland"
	"tirol"
)

var endpoint = "/endpoint"
var cache CacheManager
var database DatabaseManager
var workerFactories = make(map[string]core.WorkerFactory)

type Payload struct {
	Command             string `json:"command" structs:"command"`
	Script              string `json:"script" structs:"script,omitempty"`
	core.HarvestOptions `json:",inline" structs:"-"`
}

func register(factory core.WorkerFactory) {
	worker := factory()
	workerFactories[worker.ScriptName()] = factory
}

func initStorage() {
	cacheManager := flag.String("cache", "redis", "inmemory/redis")
	databaseManager := flag.String("db", "postgres", "inmemory/postgres")
	flag.Parse()
	log.WithFields(log.Fields{
		"cache": *cacheManager,
		"db":    *databaseManager,
	}).Info("starting storage...")
	switch *cacheManager {
	case "redis":
		cache = NewRedisCacheManager()
	case "inmemory":
		cache = NewInmemoryDB()
	default:
		log.Fatal("invalid cache manager")
	}

	switch *databaseManager {
	case "postgres":
		database = NewPostgresManager()
	case "inmemory":
		database = NewInmemoryDB()
	default:
		log.Fatal("invalid database manager")
	}
	log.Info("storage started")
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

	var err error
	switch payload.Command {
	case "list":
		result = list()
	case "autofill":
		worker := workerFactories[payload.Script]()
		result, err = worker.Autofill()
	case "harvest":
		worker := workerFactories[payload.Script]()
		result, err = harvest(&database, &cache, &worker, &payload)
		go cache.SaveOpLog(payload.Script, payload.Code, err, getResultCount(result))
	default:
		logger.Error("bad command")
		sendFailure(res, fmt.Errorf("bad command: %s", payload.Command))
		return
	}
	sendSuccess(res, err, result, &logger)
}

func startWorkers() {
	log.Info("staring workers...")

	register(galicia.NewWorkerGalicia)
	register(galicia2.NewWorkerGalicia2)
	register(georgia.NewWorkerGeorgia)
	register(norway.NewWorkerNorway)
	register(all_at_once.NewWorkerAllAtOnce)
	register(one_by_one.NewWorkerOneByOne)
	register(riverzone.NewWorkerRiverzone)
	register(chile.NewWorkerChile)
	register(tirol.NewWorkerTirol)
	register(switzerland.NewWorkerSwitzerland)
	register(ecuador.NewWorkerEcuador)

	log.Info("started workers")
}

func main() {
	logging.ConfigureLogging()

	if core.Client == nil {
		log.Fatal("failed to initialize http client")
		return
	}

	initStorage()
	startWorkers()

	http.HandleFunc("/", handler)

	var port = os.Getenv("WORKERS_PORT")
	if port == "" {
		port = "7080"
	}
	var ep = os.Getenv("WORKERS_ENDPOINT")
	if ep != "" {
		endpoint = ep
	}

	log.WithFields(log.Fields{
		"port":     port,
		"endpoint": endpoint,
	}).Info("workers are listening")

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
