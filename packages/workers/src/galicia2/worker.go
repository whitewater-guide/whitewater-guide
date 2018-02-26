package main

import (
  "github.com/doomsower/whitewater/workers/core"
  "github.com/spf13/pflag"
)

type worker struct{
  core.NamedWorker
}

func (w *worker) HarvestMode() string {
  return core.AllAtOnce
}

func (w *worker) Autofill() ([]core.GaugeInfo, error) {
  gauges, err := parseTable()
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

func (w *worker) Harvest(_ string, _ int64, _ *pflag.FlagSet) ([]core.Measurement, error) {
  gauges, err := parseTable()
  if err != nil {
    return nil, err
  }
  measurements := make([]core.Measurement, len(gauges))
  for i, g := range gauges {
    measurements[i] = g.Measurement
    measurements[i].GaugeId = g.GaugeId
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
