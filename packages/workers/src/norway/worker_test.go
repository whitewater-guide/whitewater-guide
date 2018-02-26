package main

import (
  "testing"
  "strings"
  "github.com/spf13/pflag"
)

func TestAutofill(t *testing.T) {
  w := worker{}

  gauges, e := w.Autofill()

  if e != nil {
    t.Errorf("Should work")
  }

  if len(gauges) < 300 {
    t.Errorf("Should extract some gauges")
  }

  g := gauges[0]

  if strings.Index(g.Code, ".") <= 0 {
    t.Errorf("Gauge code got screwed")
  }

  if g.Url == "" {
    t.Errorf("Gauge url got screwed")
  }
}

func TestHarvestJson(t *testing.T) {
  w := worker{}

  flags := pflag.NewFlagSet("test", pflag.ContinueOnError)
  flags.String("version", "1", "-")
  flags.Bool("html", false, "-")

  code := "2.268"
  measurements, err := w.Harvest(code, 0, flags)
  if err != nil {
    t.Errorf("Should work")
  }

  if len(measurements) < 2 {
    t.Errorf("Should extract some measurements")
  }

  m0 := measurements[0]

  if m0.Code != code {
    t.Errorf("Should set code correctly")
  }

  if m0.Flow == 0.0 {
    t.Errorf("Should extract flow correctly")
  }

  _, e := w.Harvest(code, measurements[5].Timestamp.Unix(), flags)
  if e != nil {
    t.Errorf("Should support since flag")
  }
}

func TestHarvestHTML(t *testing.T) {
  w := worker{}

  flags := pflag.NewFlagSet("test", pflag.ContinueOnError)
  flags.String("version", "1", "-")
  flags.Bool("html", true, "-")

  code := "213.4"
  measurements, err := w.Harvest(code, 0, flags)
  if err != nil {
    t.Errorf("Should work")
  }

  if len(measurements) != 1 {
    t.Errorf("Should extract one measurement")
  }

  m0 := measurements[0]

  if m0.Code != code {
    t.Errorf("Should set code correctly")
  }

  if m0.Flow == 0.0 {
    t.Errorf("Should extract flow correctly")
  }

  if m0.Timestamp.Unix() == 0.0 {
    t.Errorf("Should extract timestamp correctly")
  }
}