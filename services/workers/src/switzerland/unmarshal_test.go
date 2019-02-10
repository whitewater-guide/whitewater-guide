package switzerland

import (
  "encoding/xml"
  "github.com/google/go-cmp/cmp"
  "github.com/stretchr/testify/assert"
  "math"
  "testing"
  "time"
)

func TestUnmarshalXML(t *testing.T) {
  assert := assert.New(t)
  data := `
<?xml version='1.0' encoding='utf-8'?>
<locations xmlns:schemaLocation="http://www.hydrodaten.admin.ch/lhg/az/xml/hydroweb.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" export-time="2019-02-09T21:45:32" timezone="GMT+1">
    <station number="2004" name="Murten" water-body-name="Murtensee" water-body-type="lake" easting="575500" northing="197790">
        <parameter type="2" variant="0" name="Pegel m ü. M." unit="m ü. M.">
            <datetime>2019-02-09T21:40:00</datetime>
            <value warn-level-class="1">429.09</value>
            <previous-24h>429.09</previous-24h>
            <delta-24h>0.00</delta-24h>
            <max-24h warn-level-class="1">429.10</max-24h>
            <mean-24h>429.09</mean-24h>
            <min-24h>429.08</min-24h>
            <max-1h>429.09</max-1h>
            <mean-1h>429.09</mean-1h>
            <min-1h>429.09</min-1h>
        </parameter>
    </station>
    <station number="2009" name="Porte du Scex" water-body-name="Rhône" water-body-type="river" easting="557660" northing="133280">
        <parameter type="3" variant="0" name="Temperatur" unit="°C">
            <datetime>2019-02-09T21:40:00</datetime>
            <value temperature-class="1">5.3</value>
            <previous-24h>4.5</previous-24h>
            <delta-24h>0.8</delta-24h>
            <max-24h temperature-class="1">5.6</max-24h>
            <mean-24h>4.9</mean-24h>
            <min-24h>4.4</min-24h>
            <max-1h>5.3</max-1h>
            <mean-1h>5.3</mean-1h>
            <min-1h>5.3</min-1h>
        </parameter>
        <parameter type="2" variant="0" name="Pegel m ü. M." unit="m ü. M.">
            <datetime>2019-02-09T21:40:00</datetime>
            <value>374.49</value>
            <previous-24h>374.86</previous-24h>
            <delta-24h>-0.37</delta-24h>
            <max-24h>374.91</max-24h>
            <mean-24h>374.61</mean-24h>
            <min-24h>374.44</min-24h>
            <max-1h>374.49</max-1h>
            <mean-1h>374.47</mean-1h>
            <min-1h>374.45</min-1h>
        </parameter>
        <parameter type="10" variant="10" name="Abfluss m3/s" unit="m3/s">
            <datetime>2019-02-09T21:40:00</datetime>
            <value>NaN</value>
            <previous-24h>NaN</previous-24h>
            <delta-24h>NaN</delta-24h>
            <max-24h>NaN</max-24h>
            <mean-24h>NaN</mean-24h>
            <min-24h>NaN</min-24h>
            <max-1h>NaN</max-1h>
            <mean-1h>NaN</mean-1h>
            <min-1h>NaN</min-1h>
        </parameter>
    </station>
</locations>
    `
  expected := SwissDataRoot{
    XMLName: xml.Name{Local: "locations"},
    Stations: []SwissStation{
      {
        XMLName: xml.Name{Local: "station"},
        Code:          "2004",
        Name:          "Murten",
        WaterBodyName: "Murtensee",
        WaterBodyType: "lake",
        Easting:       575500,
        Northing:      197790,
        Parameters: []SwissParameter{
          {
            XMLName: xml.Name{Local: "parameter"},
            Type:     2,
            Variant:  0,
            Name:     "Pegel m ü. M.",
            Unit:     "m ü. M.",
            Datetime: SwissTime{time.Date(2019, time.February, 9, 21, 40, 0, 0, time.UTC)},
            Value:    429.09,
          },
        },
      },
      {
        XMLName: xml.Name{Local: "station"},
        Code:          "2009",
        Name:          "Porte du Scex",
        WaterBodyName: "Rhône",
        WaterBodyType: "river",
        Easting:       557660,
        Northing:      133280,
        Parameters: []SwissParameter{
          {
            XMLName: xml.Name{Local: "parameter"},
            Type:     3,
            Variant:  0,
            Name:     "Temperatur",
            Unit:     "°C",
            Datetime: SwissTime{time.Date(2019, time.February, 9, 21, 40, 0, 0, time.UTC)},
            Value:    5.3,
          },
          {
            XMLName: xml.Name{Local: "parameter"},
            Type:     2,
            Variant:  0,
            Name:     "Pegel m ü. M.",
            Unit:     "m ü. M.",
            Datetime: SwissTime{time.Date(2019, time.February, 9, 21, 40, 0, 0, time.UTC)},
            Value:    374.49,
          },
          {
            XMLName: xml.Name{Local: "parameter"},
            Type:     10,
            Variant:  10,
            Name:     "Abfluss m3/s",
            Unit:     "m3/s",
            Datetime: SwissTime{time.Date(2019, time.February, 9, 21, 40, 0, 0, time.UTC)},
            Value:    math.NaN(),
          },
        },
      },
    },
  }
  actual := SwissDataRoot{}

  err := xml.Unmarshal([]byte(data), &actual)
  if assert.NoError(err) {
    opt := cmp.Comparer(func(x, y float64) bool {
      return (math.IsNaN(x) && math.IsNaN(y)) || x == y
    })
    assert.Equal(cmp.Diff(actual, expected, opt), "")
  }
}
