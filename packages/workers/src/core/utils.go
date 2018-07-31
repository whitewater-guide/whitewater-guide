package core

import (
  "sort"
  "time"
)

// Gauge code + timestamp uniquely identifies measurement
type MKey struct {
  code      string
  timestamp HTime
}

func unixHTime(sec int64) HTime {
  return HTime{time.Unix(sec, 0)}
}

func FilterMeasurements(measurements []Measurement, since int64) []Measurement {
  l := len(measurements)
  seen := make(map[MKey]struct{}, l)
  result := make([]Measurement, 0)
  for _, m := range measurements {
    // Omit measurements where both flow and level are 0
    // Omit measurements that are too old
    if (m.Flow == 0.0 && m.Level == 0.0) || (m.Timestamp.Unix() <= since) {
      continue
    }
    // Filter measurement by unique (code:timestamp) pair
    key := MKey{m.Code, m.Timestamp}
    if _, ok := seen[key]; ok {
      continue
    }
    seen[key] = struct{}{}
    // Result is sorted by gauge code asc, date desc, insert into sorted slice
    insertAt := sort.Search(
      len(result),
      func(i int) bool {
        if result[i].Code == m.Code {
          return result[i].Timestamp.Unix() < m.Timestamp.Unix()
        } else {
          return result[i].Code > m.Code
        }
      },
    )
    result = append(result, Measurement{})
    copy(result[insertAt+1:], result[insertAt:])
    result[insertAt] = m
  }
  return result
}

func FilterByLast(measurements []Measurement, last map[GaugeId]Measurement) []Measurement {
  // TODO: test me
  result := make([]Measurement, 0)
  for _, m := range measurements {
    if l, ok := last[m.GaugeId]; ok {
      if m.Timestamp.After(l.Timestamp.Time) {
        result = append(result, m)
      }
    } else {
      result = append(result, m)
    }
  }
  return result
}
