package switzerland

import (
	"core"
	"github.com/spf13/pflag"
)

type workerSwitzerland struct{}

func (w *workerSwitzerland) ScriptName() string {
	return "switzerland"
}

func (w *workerSwitzerland) HarvestMode() string {
	return core.AllAtOnce
}

func (w *workerSwitzerland) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	return nil
}

func (w *workerSwitzerland) Autofill() (gauges []core.GaugeInfo, err error) {
	gauges, err = parseXML(w.ScriptName())
	if err != nil {
		return nil, nil
	}

	numGauges := len(gauges)
	//numGauges := 10
	numWorkers := 10
	jobsCh := make(chan *core.GaugeInfo, numGauges)
	resultsCh := make(chan struct{}, numGauges)

	for w := 1; w <= numWorkers; w++ {
		go gaugePageWorker(jobsCh, resultsCh)
	}
	for i := 0; i < numGauges; i++ {
		jobsCh <- &(gauges[i])
	}
	close(jobsCh)
	for i := 0; i < numGauges; i++ {
		<-resultsCh
	}
	close(resultsCh)
	return gauges, nil
}

func (w *workerSwitzerland) Harvest(_ core.HarvestOptions) ([]core.Measurement, error) {
	infos, err := parseXML(w.ScriptName())
	if err != nil {
		return nil, nil
	}
	result := make([]core.Measurement, len(infos))
	for i, v := range infos {
		result[i] = v.Measurement
	}
	return result, nil
}

func NewWorkerSwitzerland() core.Worker {
	return &workerSwitzerland{}
}
