package switzerland

import (
	"encoding/xml"
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

type AKTData struct {
	XMLName xml.Name `xml:"AKT_Data"`
	Gauges  []Gauge  `xml:"MesPar"`
}

type Gauge struct {
	XMLName  xml.Name  `xml:"MesPar"`
	Type     string    `xml:"Typ,attr"`
	Code     string    `xml:"StrNr,attr"`
	Name     string    `xml:"Name"`
	Datum    string    `xml:"Datum"`
	Zeit     string    `xml:"Zeit"`
	Readings []Reading `xml:"Wert"`
}

type Reading struct {
	XMLName xml.Name `xml:"Wert"`
	Type    string   `xml:"Typ,attr"`
	Delta   string   `xml:"dt,attr"`
	Value   float64  `xml:",chardata"`
}
