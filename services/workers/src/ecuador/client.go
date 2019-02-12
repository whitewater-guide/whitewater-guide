package ecuador

import (
  "core"
  "fmt"
  "github.com/avast/retry-go"
  log "github.com/sirupsen/logrus"
  "io/ioutil"
  "net/http"
  "net/url"
  "os"
  "strconv"
  "strings"
)

var client *core.HttpClient
var proxies []string

func init() {
  proxiesStr := os.Getenv("ECUADOR_PROXIES")
  if proxiesStr == "" {
    client = core.Client
    return
  }
  proxies = strings.Split(proxiesStr, ",")
  client = core.NewClient(false)
  client.Transport = &http.Transport{Proxy: func(req *http.Request) (*url.URL, error) {
    retriesStr := req.Header.Get("X-Proxy-Retries")
    if retriesStr == "" {
      return nil, nil
    }
    retries, err := strconv.ParseInt(retriesStr, 10, 64)
    if err != nil {
      return nil, fmt.Errorf("incorrect X-Proxy-Retries value: %s", retriesStr)
    }
    if retries == int64(len(proxies) + 1) {
      return nil, nil
    }
    if retries > int64(len(proxies)) {
      return nil, fmt.Errorf("value of X-Proxy-Retries %d is greater then number of proxies %d", retries, len(proxies))
    }
    proxy := proxies[retries-1]
    proxyURL, err := url.Parse("http://" + proxy)
    if err != nil {
      return nil, err
    }
    return proxyURL, nil
  }}
}

func fetch(url string) (body []byte, err error) {
  var retries = len(proxies)

  err = retry.Do(
    func() error {
      req, _ := http.NewRequest("GET", url, nil)
      req.Header.Set("X-Proxy-Retries", strconv.Itoa(retries))
      retries = retries - 1
      resp, err := core.Client.Do(req)


      if err == nil {
        defer func() {
          if err := resp.Body.Close(); err != nil {
            panic(err)
          }
        }()
        body, err = ioutil.ReadAll(resp.Body)
      }

      return err
    },
    retry.Attempts(uint(len(proxies) + 1)),
    retry.OnRetry(func(n uint, err error) {
      log.WithError(err).WithFields(log.Fields{"attempt": n, "url": url}).Warn("failed to fetch")
    }),
  )
  return
}
