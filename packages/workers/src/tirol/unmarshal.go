package tirol

import (
	"strconv"
	"time"
)

type GTime struct {
	time.Time
}

func (self *GTime) UnmarshalJSON(b []byte) (err error) {
	i, err := strconv.ParseFloat(string(b), 64)
	if err != nil {
		return
	}
	t := time.Unix(int64(i), 0)
	self.Time = t.UTC()
	return
}

type Gauge struct {
	Values    Values  `json:"values"`
	Name      string  `json:"name"`
	WtoObject string  `json:"WTO_OBJECT"`
	Code      string  `json:"number"`
	Longitude float64 `json:"longitude,string"`
	Latitude  float64 `json:"latitude,string"`
	Altitude  float64 `json:"altitude,string"`
}

type Values struct {
	Flows  ValueL1 `json:"W"`
	Levels ValueL1 `json:"Q"`
}

type ValueL1 struct {
	Value ValueL2 `json:"15m.Cmd.HD"`
}

type ValueL2 struct {
	Value     float64 `json:"v"`
	Timestamp GTime   `json:"dt"`
	Unit      string  `json:"unit"`
}
