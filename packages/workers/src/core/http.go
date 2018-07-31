package core

import (
  "net/http"
  jar "github.com/juju/persistent-cookiejar"
  "os"
  "time"
  "strconv"
  "net/url"
  "io/ioutil"
  "strings"
  )

const UserAgent = "whitewater.guide robot"

type HttpClient struct {
  *http.Client
  PersistentJar *jar.Jar
}

var Client *HttpClient

func InitHttpClient() (err error) {
  jarOpts := jar.Options{
    Filename: "/tmp/cookies/workers.cookies",
  }
  persJar, err := jar.New(&jarOpts)
  if err != nil {
    return
  }
  Client = &HttpClient{
    Client:        &http.Client{Jar: persJar},
    PersistentJar: persJar,
  }

  reqTimeout := 60 * time.Second
  reqTimeoutStr := os.Getenv("REQUEST_TIMEOUT")
  if reqTimeoutStr == "" {
    reqTimeountSec, e := strconv.ParseInt(reqTimeoutStr, 10, 64)
    if e == nil {
      reqTimeout = time.Duration(reqTimeountSec) * time.Second
    }
  }
  Client.Timeout = reqTimeout
  return nil
}

func (client *HttpClient) EnsureCookie(cookieUrl, fetchUrl string) (err error) {
  cUrl, err := url.Parse(cookieUrl)
  if err != nil {
    return
  }
  cookies := client.PersistentJar.Cookies(cUrl)
  if len(cookies) == 0 {
    resp, err := client.Get(fetchUrl)
    if err != nil {
      resp.Body.Close()
    }
  }
  return
}

func (client *HttpClient) SaveCookies() {
  client.PersistentJar.Save()
}

func (client *HttpClient) Get(url string) (resp *http.Response, err error) {
  req, err := http.NewRequest("GET", url, nil)
  if err != nil {
    return
  }
  req.Header.Set("User-Agent", UserAgent)
  req.Header.Set("Cache-Control", "no-cache")
  resp, err = client.Do(req)
  return
}

func (client *HttpClient) GetAsString(url string) (string, error) {
  resp, err := client.Get(url)
  if err != nil {
    return "", err
  }
  defer resp.Body.Close()
  bytes, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    return "", err
  }
  return string(bytes), nil
}

func (client *HttpClient) PostForm(url string, data url.Values) (resp *http.Response, req *http.Request, err error) {
  req, err = http.NewRequest("POST", url, strings.NewReader(data.Encode()))
  if err != nil {
    return
  }
  req.Header.Set("User-Agent", UserAgent)
  req.Header.Set("Cache-Control", "no-cache")
  req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
  resp, err = client.Do(req)
  return
}

func (client *HttpClient) PostFormAsString(url string, data url.Values) (result string, req *http.Request, err error) {
  resp, req, err := client.PostForm(url, data)
  if err != nil {
    return "", req, err
  }
  defer resp.Body.Close()
  bytes, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    return "", req, err
  }
  return string(bytes), req, nil
}
