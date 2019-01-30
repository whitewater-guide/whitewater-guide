package georgia

import (
	"core"
	"testing"
	"time"
)

func TestHarvest(t *testing.T) {
	w := workerGeorgia{}

	measurements, e := w.Harvest(core.HarvestOptions{})

	if e != nil {
		t.Errorf("Should work")
	}

	if len(measurements) < 1 {
		t.Errorf("Should extract some measurements")
	}

	m := measurements[0]

	if m.Script == "" {
		t.Errorf("Gauge script name got screwed")
	}

	if m.Code == "" {
		t.Errorf("Gauge code got screwed")
	}

	if m.Level <= 0 {
		t.Errorf("Gauge data got screwed")
	}

	now := time.Now()
	diff := now.Sub(m.Timestamp.Time)
	if diff.Hours() > 24 {
		t.Errorf("Gauge timestamp got screwed")
	}
}
