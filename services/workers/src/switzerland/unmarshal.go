package switzerland

import (
  "encoding/xml"
  "time"
)

var SwissTimezone, _ = time.LoadLocation("CET")

type SwissTime struct {
  time.Time
}


func (c *SwissTime) UnmarshalXML(d *xml.Decoder, start xml.StartElement) error {
  var v string
  d.DecodeElement(&v, &start)
  t, err := time.ParseInLocation("2006-01-02T15:04:05", v, SwissTimezone)
  if err != nil {
    return err
  }
  *c = SwissTime{t}
  return nil
}

type SwissDataRoot struct {
  XMLName  xml.Name       `xml:"locations"`
  Stations []SwissStation `xml:"station"`
}

type SwissStation struct {
  XMLName       xml.Name         `xml:"station"`
  Code          string           `xml:"number,attr"`
  Name          string           `xml:"name,attr"`
  WaterBodyName string           `xml:"water-body-name,attr"`
  WaterBodyType string           `xml:"water-body-type,attr"`
  Easting       int              `xml:"easting,attr"`
  Northing      int              `xml:"northing,attr"`
  Parameters    []SwissParameter `xml:"parameter"`
}

type SwissParameter struct {
  XMLName  xml.Name  `xml:"parameter"`
  Type     int       `xml:"type,attr"`
  Variant  int       `xml:"variant,attr"`
  Name     string    `xml:"name,attr"`
  Unit     string    `xml:"unit,attr"`
  Datetime SwissTime `xml:"datetime"`
  Value    float64   `xml:"value"`
}
