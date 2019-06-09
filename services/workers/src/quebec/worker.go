package quebec

import (
	"core"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/pflag"
	"math"
)

type workerQuebec struct{}

func (w *workerQuebec) ScriptName() string {
	return "quebec"
}

func (w *workerQuebec) HarvestMode() string {
	return core.OneByOne
}

func (w *workerQuebec) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	return nil
}

func (w *workerQuebec) Autofill(options map[string]interface{}) (result []core.GaugeInfo, err error) {
	federal, err := getReferenceList(w.ScriptName())
	var local []stationInfo
	if err != nil {
		return nil, err
	}
	codes, err := getCodes()
	if err != nil {
		return nil, err
	}

	jobsCh := make(chan string, len(codes))
	resultsCh := make(chan stationInfo, len(codes))
	numWorkers := int(math.Min(5, float64(len(codes))))
	for i := 0; i < numWorkers; i++ {
		go w.stationWorker(jobsCh, resultsCh)
	}
	for _, code := range codes {
		jobsCh <- code
	}
	close(jobsCh)
	for range codes {
		info := <-resultsCh
		if info.isLocal {
			local = append(local, info)
		}
	}
	close(resultsCh)

	for _, info := range local {
		var gaugeInfo core.GaugeInfo
		if fedInfo, ok := federal[info.federalCode]; ok {
			gaugeInfo = fedInfo
			gaugeInfo.Name = info.name + " (" + info.code + ")"
			gaugeInfo.Code = info.code
			gaugeInfo.Url = "https://www.cehq.gouv.qc.ca/suivihydro/graphique.asp?NoStation=" + info.code
		} else {
			log.WithFields(log.Fields{
				"script":      w.ScriptName(),
				"command":     "harvest",
				"federalCode": info.federalCode,
				"code":        info.code,
			}).Warn("no federal reference found")
			gaugeInfo = core.GaugeInfo{
				GaugeId: core.GaugeId{
					Code:   info.code,
					Script: w.ScriptName(),
				},
				Name:      info.name + " (" + info.code + ")",
				FlowUnit:  "m3/s",
				LevelUnit: "m",
				Url:       "https://www.cehq.gouv.qc.ca/suivihydro/graphique.asp?NoStation=" + info.code,
			}
		}
		result = append(result, gaugeInfo)
	}
	return
}

func (w *workerQuebec) Harvest(opts core.HarvestOptions) ([]core.Measurement, error) {
	return getReadings(w.ScriptName(), opts.Code)
}

func NewWorkerQuebec() core.Worker {
	return &workerQuebec{}
}

func (w *workerQuebec) stationWorker(codes <-chan string, results chan<- stationInfo) {
	for code := range codes {
		info, err := parsePage(code)
		if err != nil {
			log.WithFields(log.Fields{
				"script":  w.ScriptName(),
				"command": "harvest",
				"code":    code,
			}).Error(err)
		}
		results <- *info
	}
}
