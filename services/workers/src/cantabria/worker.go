package cantabria

import (
	"core"
	"github.com/spf13/pflag"
)

type workerCantabria struct{}

func (w *workerCantabria) ScriptName() string {
	return "cantabria"
}

func (w *workerCantabria) HarvestMode() string {
	return core.AllAtOnce
}

func (w *workerCantabria) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	return nil
}

func (w *workerCantabria) Autofill() ([]core.GaugeInfo, error) {
	gauges, err := parseTable(w.ScriptName())
	if err != nil {
		return gauges, err
	}

	jobsCh := make(chan *core.GaugeInfo, len(gauges))
	resultsCh := make(chan struct{}, len(gauges))

	for w := 1; w <= 10; w++ {
		go gaugePageWorker(jobsCh, resultsCh)
	}
	for i := range gauges {
		jobsCh <- &(gauges[i])
	}
	close(jobsCh)
	for range gauges {
		<-resultsCh
	}
	close(resultsCh)
	return gauges, nil
}

func (w *workerCantabria) Harvest(options core.HarvestOptions) ([]core.Measurement, error) {
	gauges, err := parseTable(w.ScriptName())
	if err != nil {
		return nil, err
	}
	measurements := make([]core.Measurement, len(gauges))
	for i, g := range gauges {
		measurements[i] = g.Measurement
	}
	return measurements, nil
}

func gaugePageWorker(gauges <-chan *core.GaugeInfo, results chan<- struct{}) {
	for gauge := range gauges {
		latitude, longitude := parseGaugeLocation((*gauge).Code)
		gauge.Location.Latitude = latitude
		gauge.Location.Longitude = longitude
		results <- struct{}{}
	}
}

func NewWorkerCantabria() core.Worker {
	return &workerCantabria{}
}
