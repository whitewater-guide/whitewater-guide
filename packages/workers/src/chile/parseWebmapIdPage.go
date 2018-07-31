package chile

import (
  "encoding/json"
  "net/http"
)

const (
  webmapIdPageUrl = "http://www.arcgis.com/sharing/rest/content/items/d508beb3a88f43d28c17a8ec9fac5ef0/data?f=json"
  //webmapIdPageUrl = "https://gist.githubusercontent.com/doomsower/8d32132a598ce39eebcb6f7ceb704a34/raw/67fe09e2a2f27ff175d1b0c0a6d4585b6fe67232/chile_second_req.json"
)

type WebmapIdPageValues struct {
  Webmap string `json:"webmap"`
}

type WebmapIdPage struct {
  Values WebmapIdPageValues `json:"values"`
}

func getWebmapId() (string, error) {
  resp, err := http.Get(webmapIdPageUrl)

  if err != nil {
    return "", err
  }
  defer resp.Body.Close()
  response := &WebmapIdPage{}
  err = json.NewDecoder(resp.Body).Decode(response)
  if err != nil {
    return "", err
  }
  return response.Values.Webmap, nil
}
