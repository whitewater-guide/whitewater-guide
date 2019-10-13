package canada

import (
	"core"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/pflag"
	"math"
)

type workerCanada struct {
}

func (w *workerCanada) ScriptName() string {
	return "canada"
}

func (w *workerCanada) HarvestMode() string {
	return core.AllAtOnce
}

func (w *workerCanada) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	provinces, _ := flags.GetString("provinces")
	return map[string]interface{}{
		"provinces": provinces,
	}
}

func (w *workerCanada) Autofill(options map[string]interface{}) (result []core.GaugeInfo, err error) {
	stations, err := getStationList()
	if err != nil {
		return
	}
	provinces := getProvinces(options)
	for _, station := range stations {
		if _, included := provinces[station.province]; !included {
			continue
		}
		result = append(result, core.GaugeInfo{
			GaugeId: core.GaugeId{
				Code:   station.id,
				Script: w.ScriptName(),
			},
			Location: core.Location{
				Longitude: station.longitude,
				Latitude:  station.latitude,
			},
			LevelUnit: "m",
			FlowUnit:  "m3/s",
			Name:      station.name,
			Url:       "https://wateroffice.ec.gc.ca/report/real_time_e.html?stn=" + station.id,
		})
	}
	return
}

func (w *workerCanada) Harvest(options core.HarvestOptions) ([]core.Measurement, error) {
	provinces := getProvinces(options.Extras)

	log.WithFields(log.Fields{
		"script":   w.ScriptName(),
		"command":  "harvest",
		"provinces": len(provinces),
	}).Info("start harvest")

	jobsCh := make(chan string, len(provinces))
	resultsCh := make(chan []core.Measurement, len(provinces))
	var results []core.Measurement

	numWorkers := int(math.Min(3, float64(len(provinces))))
	for i := 0; i < numWorkers; i++ {
		go w.provinceWorker(jobsCh, resultsCh)
	}
	for prov := range provinces {
		jobsCh <- prov
	}
	close(jobsCh)
	for range provinces {
		provResults := <-resultsCh
		results = append(results, provResults...)
	}
	close(resultsCh)

	log.WithFields(log.Fields{
		"script":   w.ScriptName(),
		"command":  "harvest",
		"count": len(results),
	}).Info("canada done")

	return results, nil
}

func (w *workerCanada) provinceWorker(provinces <-chan string, results chan<- []core.Measurement) {
	for province := range provinces {
		log.WithFields(log.Fields{
			"script":   w.ScriptName(),
			"command":  "harvest",
			"province": province,
		}).Info("canada province worker")
		measurements, err := fetchMeasurements(w.ScriptName(), province)
		if err != nil {
			log.WithFields(log.Fields{
				"script":   w.ScriptName(),
				"command":  "harvest",
				"province": province,
			}).Error(err)
		} else {
			log.WithFields(log.Fields{
				"script":   w.ScriptName(),
				"command":  "harvest",
				"province": province,
			}).Info("canada province done")
		}
		results <- measurements
	}
}

func NewWorkerCanada() core.Worker {
	return &workerCanada{}
}
