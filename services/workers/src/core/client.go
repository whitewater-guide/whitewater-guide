package core

import (
  "bytes"
  "github.com/EDDYCJY/fake-useragent"
  jar "github.com/juju/persistent-cookiejar"
  log "github.com/sirupsen/logrus"
  "github.com/sirupsen/logrus"
  "io/ioutil"
  "net/http"
  "net/http/httptest"
  "net/url"
  "os"
  "strconv"
  "strings"
  "time"
)

type HttpClient struct {
  *http.Client
  PersistentJar *jar.Jar
  UserAgent     string
  useCache      bool
  hasher        Hasher
  cacher        Cacher
}

var Client = NewClient(false)

func NewClient(noDevCache bool) *HttpClient {
  jarOpts := jar.Options{
    Filename: "/tmp/cookies/workers.cookies",
  }
  persJar, err := jar.New(&jarOpts)
  if err != nil {
    log.Error(err)
    return nil
  }
  client := &HttpClient{
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
  client.Timeout = reqTimeout

  ua := os.Getenv("WORKERS_USER_AGENT")
  if ua == "" {
    ua = "whitewater.guide robot"
  }
  client.UserAgent = ua

  if !noDevCache && os.Getenv("WORKERS_ENV") == "development" {
    client.hasher = DefaultHasher{}
    diskCacher := NewDiskCacher("/tmp/cache")
    diskCacher.SeedCache()
    client.cacher = diskCacher
  }

  return client
}

func (client *HttpClient) EnsureCookie(cookieUrl, fetchUrl string, force bool) (err error) {
  cUrl, err := url.Parse(cookieUrl)
  if err != nil {
    return
  }
  cookies := client.PersistentJar.Cookies(cUrl)
  if force || len(cookies) == 0 {
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

// Same as http.Client.Get, but sets extra headers and is cached in development environment
// See `Do` method for description of variadic args
func (client *HttpClient) Get(url string, args ...interface{}) (resp *http.Response, err error) {
  req, err := http.NewRequest("GET", url, nil)
  if err != nil {
    return
  }
  resp, err = client.Do(req, args...)
  return
}

// Same as http.Client.Get, but sets extra headers and is cached in development environment
// Accepts one optional boolean argument
// - fakeAgent (default = false) - if true, will add fake `User-Agent` header
func (client *HttpClient) Do(req *http.Request, args ...interface{}) (resp *http.Response, err error) {
  ua := client.UserAgent
  fakeAgent := parseClientExtras(args...)
  if fakeAgent {
    ua = browser.MacOSX()
  }
  req.Header.Set("User-Agent", ua)
  req.Header.Set("Cache-Control", "no-cache")

  var hash string

  if client.hasher != nil && client.cacher != nil {
    hash = client.hasher.Hash(req)
    cached := client.cacher.Get(hash)
    if cached != nil {
      logrus.Debug("Cache hit for ", req.URL.String())
      resp = &http.Response{
        Status:        "200 OK",
        StatusCode:    200,
        Proto:         "HTTP/1.1",
        ProtoMajor:    1,
        ProtoMinor:    1,
        Body:          ioutil.NopCloser(bytes.NewReader(cached.Body)),
        ContentLength: int64(len(cached.Body)),
        Request:       req,
        Header:        make(http.Header, 0),
      }
      for k, v := range cached.Headers {
        resp.Header.Add(k, v)
      }
      return
    }
  }

  resp, err = client.Client.Do(req)

  if client.hasher != nil && client.cacher != nil {
    rec := httptest.NewRecorder()
    copyHeaders(rec.Header(), resp.Header)
    rec.WriteHeader(resp.StatusCode)

    bodyBytes, _ := ioutil.ReadAll(resp.Body)
    resp.Body.Close() //  must close
    resp.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
    rec.Write(bodyBytes)
    client.cacher.Put(hash, rec)
  }

  return
}

// Shortcut for http.Client.Get to get response as string
// See `Do` method for description of variadic args
func (client *HttpClient) GetAsString(url string, args ...interface{}) (string, error) {
  resp, err := client.Get(url, args...)
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

// Shortcut for http.Client.PostForm
// See `Do` method for description of variadic args
func (client *HttpClient) PostForm(url string, data url.Values, args ...interface{}) (resp *http.Response, req *http.Request, err error) {
  req, err = http.NewRequest("POST", url, strings.NewReader(data.Encode()))
  if err != nil {
    return
  }
  req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
  resp, err = client.Do(req, args...)
  return
}

// Shortcut for http.Client.PostForm to get response as string
// See `Do` method for description of variadic args
func (client *HttpClient) PostFormAsString(url string, data url.Values, args ...interface{}) (result string, req *http.Request, err error) {
  resp, req, err := client.PostForm(url, data, args...)
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
