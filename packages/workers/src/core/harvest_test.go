package core

import (
  "testing"
  "reflect"
)

func TestFilterMeasurements(t *testing.T) {
  input := []Measurement {
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(2000), Flow: 0, Level: 0},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 2, Level: 2},
  }
  expected := []Measurement {
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 2, Level: 2},
  }
  if !reflect.DeepEqual(FilterMeasurements(input, 0), expected) {
    t.Errorf("Expected to filter 0 flow + 0 level measurements")
  }

  input = []Measurement {
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(2000), Flow: 3, Level: 3},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 2, Level: 2},
  }
  expected = []Measurement {
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 2, Level: 2},
  }
  if !reflect.DeepEqual(FilterMeasurements(input, 2000), expected) {
    t.Errorf("Expected to filter too old measurements")
  }

  input = []Measurement {
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 3, Level: 3},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 2, Level: 2},
  }
  expected = []Measurement {
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
  }
  if !reflect.DeepEqual(FilterMeasurements(input, 0), expected) {
    t.Errorf("Expected to filter duplicate code + timestamp values")
  }

  input = []Measurement {
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(2000), Flow: 2, Level: 2},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 3, Level: 3},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
  }
  expected = []Measurement {
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(1000), Flow: 1, Level: 1},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(2000), Flow: 2, Level: 2},
    Measurement{GaugeId: GaugeId{ Script: "a", Code: "1"}, Timestamp: unixHTime(3000), Flow: 3, Level: 3},
  }
  if !reflect.DeepEqual(FilterMeasurements(input, 0), expected) {
    t.Errorf("Expected to sort from oldest to newest")
  }

  input = []Measurement{}
  expected = []Measurement{}
  if !reflect.DeepEqual(FilterMeasurements(input, 0), expected) {
    t.Errorf("Expected to accept empty measurements")
  }
}