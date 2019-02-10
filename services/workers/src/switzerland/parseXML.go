package switzerland

import (
  "core"
  "encoding/xml"
  "fmt"
  "github.com/pebbe/go-proj-4/proj"
  "net/http"
  "os"
)



func fetchStations() (*SwissDataRoot, error) {
  username := os.Getenv("SWITZERLAND_USER")
  password := os.Getenv("SWITZERLAND_PASSWORD")
  if username == "" || password == "" {
    return nil, fmt.Errorf("username and password required")
  }
  req, _ := http.NewRequest("GET", "https://www.hydrodata.ch/data/plc/xml/hydroweb.xml", nil)
  req.SetBasicAuth(username, password)
  resp, err := core.Client.Do(req)

  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  response := &SwissDataRoot{}
  err = xml.NewDecoder(resp.Body).Decode(response)
  if err != nil {
    return nil, err
  }
  return response, nil
}

func getLocation(station SwissStation) (loc core.Location, err error) {
  epsg21781, err := proj.NewProj("+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs")
  defer epsg21781.Close()
  if err != nil {
    return
  }

  epsg4326, err := proj.NewProj("+proj=longlat +datum=WGS84 +no_defs")
  defer epsg4326.Close()
  if err != nil {
    return
  }

  x, y, err := proj.Transform2(epsg21781, epsg4326, float64(station.Easting), float64(station.Northing))
  if err != nil {
    return
  }
  loc.Longitude = proj.RadToDeg(x)
  loc.Latitude = proj.RadToDeg(y)
  return
}

func parseXML(script string) (result []core.GaugeInfo, err error) {
 dataRoot, err := fetchStations()
 if err != nil {
   return
 }
 for _, station := range dataRoot.Stations {
   name := station.WaterBodyName + " - " + station.Name
   if station.WaterBodyType != "river" {
     name += " (" + station.WaterBodyType + ")"
   }

   // there will be at most one param for flow, and at most one for flow
   // there is test that proves this
   var flowParam, levelParam *SwissParameter
   for _, param := range station.Parameters {
     switch param.Type {
     case 10, 22:
       flowParam = &param
     case 1, 2, 28:
       levelParam = &param
     }
   }

   var loc core.Location
   loc, err = getLocation(station)
   if err != nil {
     return
   }

   info := core.GaugeInfo{
     GaugeId: core.GaugeId{
       Code:   station.Code,
       Script: script,
     },
     Name: name,
     Url: "https://www.hydrodaten.admin.ch/de/" + station.Code + ".html",
     Measurement: core.Measurement{
       GaugeId: core.GaugeId{
         Code: station.Code,
         Script: script,
       },
     },
     Location: loc,
   }

   if flowParam != nil {
     info.FlowUnit = flowParam.Unit
     info.Measurement.Flow = flowParam.Value
     info.Measurement.Timestamp = core.HTime{Time: flowParam.Datetime.Time}
   }
   if levelParam != nil {
     info.LevelUnit = levelParam.Unit
     info.Measurement.Level = levelParam.Value
     // it's safe to overwrite. Timestamps are equal for all the params (see tests)
     info.Measurement.Timestamp = core.HTime{Time: levelParam.Datetime.Time}
   }

   result = append(result, info)
 }
 return
}