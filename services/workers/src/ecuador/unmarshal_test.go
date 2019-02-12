package ecuador

import (
  "encoding/json"
  "github.com/stretchr/testify/assert"
  "testing"
)

const RESPONSE = `
{
  "head": {
    "transaction": 0,
    "signature": 16885,
    "environment": {
      "station_name": "Nombre Estacion",
      "table_name": "hora1",
      "model": "CR1000",
      "serial_no": "62030",
      "os_version": "CR1000.Std.27",
      "dld_name": "CPU:radar.CR1",
      "dld_sig": "53995"
    },
    "fields": [
      {
        "name": "FechaHora",
        "type": "xsd:string",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "nivelMax",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "Calidad(1)",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "nivelMin",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "Calidad(2)",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "nivelAvg",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "Calidad(3)",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "nivelSmp",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "Calidad(4)",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "nivelStd",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "Calidad(5)",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "battVolt",
        "type": "xsd:double",
        "units": "voltios",
        "process": "Smp",
        "settable": false
      },
      {
        "name": "Calidad(11)",
        "type": "xsd:double",
        "process": "Smp",
        "settable": false
      }
    ]
  },
  "data": [
    {
      "no": 1001,
      "time": "2019-02-10T17:00:00",
      "vals": [ "20190210170000", 0.36, 50, 0.33, 50, 0.35, 50, 0.35, 50, 0, 50, 13.77, 50 ]
    }
  ],
  "more":  false
}
`

const RESPONSE_INAMHI=`
[
  {
    "esta__id": 34,
    "puobnomb": "COCA EN SAN SEBASTIAN",
    "puobcodi": "H1134",
    "provnomb": "ORELLANA",
    "coorlati": "-0.339722",
    "coorlong": "-77.005277",
    "cooraltu": "320.00",
    "esteicon": "http:\/\/maps.google.com\/mapfiles\/ms\/micons\/blue-dot.png",
    "estenomb": "OPERATIVA",
    "catenomb": "HIDROLOGICA",
    "proesnomb": "INAMHI"
  },
  {
    "esta__id": 63777,
    "puobnomb": "I\u00d1AQUITO",
    "puobcodi": "M0024",
    "provnomb": "PICHINCHA",
    "coorlati": "-0.175000",
    "coorlong": "-78.485278",
    "cooraltu": "2789.12",
    "esteicon": "http:\/\/maps.google.com\/mapfiles\/ms\/micons\/blue-dot.png",
    "estenomb": "OPERATIVA",
    "catenomb": "METEOROLOGICA",
    "proesnomb": "INAMHI"
  }
]
`

func TestUnmarshal(t *testing.T) {
  assert := assert.New(t)
  actual := EcuadorRoot{}

  err := json.Unmarshal([]byte(RESPONSE), &actual)
  if assert.NoError(err) {
    assert.Equal(13, len(actual.Head.Fields))
    assert.Equal(false, actual.More)
    assert.Equal([]EcuadorData{
      EcuadorData{
        No:   1001,
        Time: "2019-02-10T17:00:00",
        Vals: []interface{}{
          "20190210170000", 0.36, 50.0, 0.33, 50.0, 0.35, 50.0, 0.35, 50.0, 0.0, 50.0, 13.77, 50.0,
        },
      },
    }, actual.Data)
    assert.Equal(EcuadorField{
      Name:     "FechaHora",
      Type:     "xsd:string",
      Process:  "Smp",
      Settable: false,
    }, actual.Head.Fields[0])
  }
}

func TestUnmarshalInamhi(t *testing.T) {
  assert := assert.New(t)
  var actual []InamhiEmasItem

  err := json.Unmarshal([]byte(RESPONSE_INAMHI), &actual)
  if assert.NoError(err) {
    if assert.Equal(2, len(actual)) {
      assert.Equal(InamhiEmasItem{
        Id: 34,
        Name: "COCA EN SAN SEBASTIAN",
        Code: "H1134",
        Lat: -0.339722,
        Lng: -77.005277,
        Alt: 320.00,
        Status: "OPERATIVA",
        Category: "HIDROLOGICA",
        Source: "INAMHI",
      }, actual[0])
    }
  }
}
