package main

import (
  "testing"
  "time"
)

func TestHarvest(t *testing.T)  {
  w := worker{}

  measurements, e := w.Harvest("", 0, nil)

  if e != nil {
    t.Errorf("Should work")
  }

  if len(measurements) < 1 {
    t.Errorf("Should extract some measurements")
  }

  m := measurements[0]

  if m.Code == "" {
    t.Errorf("Gauge code got screwed")
  }

  if m.Level <= 0 || m.Flow <= 0 {
    t.Errorf("Gauge data got screwed")
  }

  now := time.Now()
  diff := now.Sub(m.Timestamp.Time)
  if diff.Hours() > 24 {
    t.Errorf("Gauge timestamp got screwed")
  }
}
