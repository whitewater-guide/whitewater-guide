package galicia2

import (
  "core"
  "github.com/spf13/pflag"
)

type workerGalicia2 struct{}

func (w *workerGalicia2) ScriptName() string {
  return "galicia2"
}

func (w *workerGalicia2) HarvestMode() string {
  return core.AllAtOnce
}

func (w *workerGalicia2) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
  return nil
}

func (w *workerGalicia2) Autofill() ([]core.GaugeInfo, error) {
  gauges, err := w.parseTable()
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

func (w *workerGalicia2) Harvest(options core.HarvestOptions) ([]core.Measurement, error) {
  gauges, err := w.parseTable()
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
    latitude, longitude, altitude := parseGaugePage((*gauge).Url)
    gauge.Location.Latitude = latitude
    gauge.Location.Longitude = longitude
    gauge.Location.Altitude = altitude
    results <- struct{}{}
  }
}

func NewWorkerGalicia2() core.Worker {
  return &workerGalicia2{}
}
