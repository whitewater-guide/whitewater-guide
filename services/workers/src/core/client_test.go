package core

import (
  "net/http"
  "net/http/httptest"
  "testing"
)

func TestHttpClient_Get(t *testing.T) {
  ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    if r.Header.Get("Cache-Control") != "no-cache" {
      t.Errorf("Expected cache-control: no-cache")
    }
    if r.Header.Get("User-Agent") != "dev.whitewater.guide robot" {
      t.Errorf("Expected User-Agent: dev.whitewater.guide robot")
    }
  }))
  defer ts.Close()
  client := NewClient(true)
  _, _ = client.Get(ts.URL)
}

func TestHttpClient_GetFakeAgent(t *testing.T) {
  ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    if r.Header.Get("Cache-Control") != "no-cache" {
      t.Errorf("Expected cache-control: no-cache")
    }
    ua := r.Header.Get("User-Agent")
    if ua == "dev.whitewater.guide robot" {
      t.Errorf("Expected fake user-agent, got '%s'", ua)
    }
  }))
  defer ts.Close()
  client := NewClient(true)
  _, _ = client.Get(ts.URL, true, 1)
}
