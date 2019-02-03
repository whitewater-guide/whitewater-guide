package norway

import (
	"core"
	"strings"
	"testing"
)

func TestAutofill(t *testing.T) {
	w := NewWorkerNorway()

	gauges, e := w.Autofill()

	if e != nil {
		t.Errorf("Should work")
	}

	if len(gauges) < 300 {
		t.Errorf("Should extract some gauges")
	}

	g := gauges[0]

	if g.Script != w.ScriptName() {
		t.Errorf("Gauge script name got screwed")
	}

	if strings.Index(g.Code, ".") <= 0 {
		t.Errorf("Gauge code got screwed")
	}

	if g.Url == "" {
		t.Errorf("Gauge url got screwed")
	}
}

func TestHarvestJson(t *testing.T) {
	w := NewWorkerNorway()

	code := "2.268"
	options := core.HarvestOptions{
		Code: code,
		Extras: map[string]interface{}{
			"version": 1.0,
			"html":    false,
		},
	}

	measurements, err := w.Harvest(options)
	if err != nil {
		t.Errorf("Should work")
	}

	if len(measurements) < 2 {
		t.Errorf("Should extract some measurements")
	}

	m0 := measurements[0]

	if m0.Script != w.ScriptName() {
		t.Errorf("Should set script name correctly")
	}
	if m0.Code != code {
		t.Errorf("Should set code correctly")
	}

	if m0.Flow == 0.0 {
		t.Errorf("Should extract flow correctly")
	}

	optionsWithSince := options
	optionsWithSince.Since = measurements[5].Timestamp.Unix()

	_, e := w.Harvest(optionsWithSince)
	if e != nil {
		t.Errorf("Should support since flag")
	}
}

func TestHarvestHTML(t *testing.T) {
	w := NewWorkerNorway()

	code := "213.4"
	options := core.HarvestOptions{
		Code: code,
		Extras: map[string]interface{}{
			"version": 1.0,
			"html":    true,
		},
	}

	measurements, err := w.Harvest(options)

	if err != nil {
		t.Errorf("Should work")
	}

	if len(measurements) != 1 {
		t.Errorf("Should extract one measurement")
	}

	m0 := measurements[0]

	if m0.Script != w.ScriptName() {
		t.Errorf("Should set script name correctly")
	}
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
