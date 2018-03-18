package main

import (
  "testing"
  "reflect"
  "core"
)

func TestFilterMeasurements(t *testing.T) {
  input := []core.Measurement {
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(2000), Flow: 0, Level: 0},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 2, Level: 2},
  }
  expected := []core.Measurement {
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 2, Level: 2},
  }
  if !reflect.DeepEqual(FilterMeasurements(input, 0), expected) {
    t.Errorf("Expected to filter 0 flow + 0 level measurements")
  }

  input = []core.Measurement {
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(2000), Flow: 3, Level: 3},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 2, Level: 2},
  }
  expected = []core.Measurement {
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 2, Level: 2},
  }
  if !reflect.DeepEqual(FilterMeasurements(input, 2000), expected) {
    t.Errorf("Expected to filter too old measurements")
  }

  input = []core.Measurement {
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 3, Level: 3},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 2, Level: 2},
  }
  expected = []core.Measurement {
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
  }
  if !reflect.DeepEqual(FilterMeasurements(input, 0), expected) {
    t.Errorf("Expected to filter duplicate code + timestamp values")
  }

  input = []core.Measurement {
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(2000), Flow: 2, Level: 2},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 3, Level: 3},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
  }
  expected = []core.Measurement {
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(2000), Flow: 2, Level: 2},
    core.Measurement{GaugeId: core.GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 3, Level: 3},
  }
  if !reflect.DeepEqual(FilterMeasurements(input, 0), expected) {
    t.Errorf("Expected to sort from oldest to newest")
  }

  input = []core.Measurement{}
  expected = []core.Measurement{}
  if !reflect.DeepEqual(FilterMeasurements(input, 0), expected) {
    t.Errorf("Expected to accept empty measurements")
  }
}