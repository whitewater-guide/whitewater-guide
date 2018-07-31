package chile

import (
  "net/http"
  "net/url"
  "io/ioutil"
  "net/http/cookiejar"
)

var _client *http.Client

func getHTTPClient() (*http.Client, error) {
  if _client == nil {
    jar, err := cookiejar.New(&cookiejar.Options{})
    if err != nil {
      return nil, err
    }
    _client = &http.Client{Jar: jar}
    resp, err := _client.Get("http://dgasatel.mop.cl")
    if err != nil {
      return nil, err
    }
    resp.Body.Close()
  }
  return _client, nil
}

func postForm(url string, data url.Values) (result string, err error) {
  client, err := getHTTPClient()
  resp, err := client.PostForm(url, data)
  if err != nil {
    return
  }
  defer resp.Body.Close()

  if err != nil {
    return
  }

  bytes, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    return
  }
  return string(bytes), nil
}

func getPage(url string) (html string, err error) {
  client, err := getHTTPClient()
  if err != nil {
    return
  }
  resp, err := client.Get(url)
  if err != nil {
    return
  }
  defer resp.Body.Close()

  if err != nil {
    return
  }

  bytes, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    return
  }
  html = string(bytes)
  return
}
