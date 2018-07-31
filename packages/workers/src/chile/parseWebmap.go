package chile

import (
  "encoding/json"
  "fmt"
  "net/http"
)

type SpatialReference struct {
  WKID       int `json:"wkid"`
  LatestWKID int `json:"latestWkid"`
}

type Geometry struct {
  X                float64          `json:"x"`
  Y                float64          `json:"y"`
  SpatialReference SpatialReference `json:"spatialReference"`
}

type Attributes struct {
  Name string `json:"NOMBRE"`
  //Name   string  `json:"NOM_SSUBC"`
  Code     string  `json:"COD_BNA"`
  Northing float64 `json:"NORTE_84"`
  Easting  float64 `json:"ESTE_84"`
}

type Feature struct {
  Geometry   Geometry   `json:"geometry"`
  Attributes Attributes `json:"attributes"`
  // Added by us
  LayerName string
}

type FeatureSet struct {
  Features []Feature `json:"features"`
}

type LayerDefinition struct {
  Name string `json:"name"`
}

type Layer struct {
  FeatureSet      FeatureSet      `json:"featureSet"`
  LayerDefinition LayerDefinition `json:"layerDefinition"`
}

type FeatureCollection struct {
  Layers []Layer `json:"layers"`
}

type OperationalLayer struct {
  FeatureCollection FeatureCollection `json:"featureCollection"`
}

type WebmapPage struct {
  OperationalLayers []OperationalLayer `json:"operationalLayers"`
}

func getWepmapUrl() (string, error) {
  webmapId, err := getWebmapId()
  if err != nil {
    fmt.Println("cant get web map id", err)
    return "", err
  }
  result := fmt.Sprintf("http://www.arcgis.com/sharing/rest/content/items/%s/data?f=json", webmapId)
  return result, nil
  //return "https://gist.github.com/doomsower/8d32132a598ce39eebcb6f7ceb704a34/raw/94b1584ed934ffd68cea7735052030b722d381a8/chile_map.json", nil
}

func parseWebmap() (map[string]Feature, error) {
  url, _ := getWepmapUrl()
  resp, err := http.Get(url)

  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()

  response := &WebmapPage{}
  err = json.NewDecoder(resp.Body).Decode(&response)
  if err != nil {
    return nil, err
  }

  result := make(map[string]Feature)
  for _, opl := range response.OperationalLayers {
    for _, l := range opl.FeatureCollection.Layers {
      for _, f := range l.FeatureSet.Features {
        f.LayerName = l.LayerDefinition.Name
        result[f.Attributes.Code] = f
      }
    }
  }
  return result, nil
}
