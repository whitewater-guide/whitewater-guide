package switzerland

import (
	"encoding/xml"
	"strconv"
	"strings"
)

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

func (self *Reading) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
	for _, attr := range start.Attr {
		switch attr.Name.Local {
		case "Typ":
			self.Type = attr.Value
		case "dt":
			self.Delta = attr.Value
		}
	}
	for {
		token, err := d.Token()
		if token == nil {
			break
		}
		if err != nil {
			return err
		}
		if v, ok := token.(xml.CharData); ok {
			strVal := strings.Replace(string([]byte(v)), "'", "", -1)
			f, e := strconv.ParseFloat(strVal, 64)
			if e != nil {
				return e
			}
			self.Value = f
		}
	}
	return nil
}
