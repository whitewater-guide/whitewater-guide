// https://github.com/nickpresta/chameleon
// The MIT License (MIT)
//
// Copyright (c) 2014 Nick Presta
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

package core

import (
  "encoding/json"
  "io/ioutil"
  "net/http/httptest"
  "path"
  "strings"
  "sync"
)

// CachedResponse respresents a response to be cached.
type CachedResponse struct {
  StatusCode int
  Body       []byte
  Headers    map[string]string
}

// SpecResponse represents a specification for a response.
type SpecResponse struct {
  StatusCode  int               `json:"status_code"`
  ContentFile string            `json:"content"`
  Headers     map[string]string `json:"headers"`
}

// Spec represents a full specification to describe a response and how to look up its index.
type Spec struct {
  SpecResponse `json:"response"`
  Key          string `json:"key"`
}

// A FileSystem interface is used to provide a mechanism of storing and retreiving files to/from disk.
type FileSystem interface {
  WriteFile(path string, content []byte) error
  ReadFile(path string) ([]byte, error)
}

// DefaultFileSystem provides a default implementation of a filesystem on disk.
type DefaultFileSystem struct {
}

// WriteFile writes content to disk at path.
func (fs DefaultFileSystem) WriteFile(path string, content []byte) error {
  return ioutil.WriteFile(path, content, 0644)
}

// ReadFile reads content from disk at path.
func (fs DefaultFileSystem) ReadFile(path string) ([]byte, error) {
  return ioutil.ReadFile(path)
}

// A Cacher interface is used to provide a mechanism of storage for a given request and response.
type Cacher interface {
  Get(key string) *CachedResponse
  Put(key string, r *httptest.ResponseRecorder) *CachedResponse
}

// DiskCacher is the default cacher which writes to disk
type DiskCacher struct {
  cache    map[string]*CachedResponse
  dataDir  string
  specPath string
  mutex    *sync.RWMutex
  FileSystem
}

// NewDiskCacher creates a new disk cacher for a given data directory.
func NewDiskCacher(dataDir string) DiskCacher {
  return DiskCacher{
    cache:      make(map[string]*CachedResponse),
    dataDir:    dataDir,
    specPath:   path.Join(dataDir, "spec.json"),
    mutex:      new(sync.RWMutex),
    FileSystem: DefaultFileSystem{},
  }
}

// SeedCache populates the DiskCacher with entries from disk.
func (c *DiskCacher) SeedCache() {
  c.mutex.Lock()
  defer c.mutex.Unlock()

  specs := c.loadSpecs()

  for _, spec := range specs {
    body, err := c.FileSystem.ReadFile(path.Join(c.dataDir, spec.SpecResponse.ContentFile))
    if err != nil {
      panic(err)
    }
    response := &CachedResponse{
      StatusCode: spec.StatusCode,
      Headers:    spec.Headers,
      Body:       body,
    }
    c.cache[spec.Key] = response
  }
}

// Get fetches a CachedResponse for a given key
func (c DiskCacher) Get(key string) *CachedResponse {
  c.mutex.RLock()
  defer c.mutex.RUnlock()
  return c.cache[key]
}

func (c DiskCacher) loadSpecs() []Spec {
  specContent, err := c.FileSystem.ReadFile(c.specPath)
  if err != nil {
    specContent = []byte{'[', ']'}
  }

  var specs []Spec
  err = json.Unmarshal(specContent, &specs)
  if err != nil {
    panic(err)
  }

  return specs
}

// Put stores a CachedResponse for a given key and response
func (c DiskCacher) Put(key string, resp *httptest.ResponseRecorder) *CachedResponse {
  c.mutex.Lock()
  defer c.mutex.Unlock()

  skipDisk := resp.Header().Get("_chameleon-seeded-skip-disk") != ""
  if skipDisk {
    resp.Header().Del("_chameleon-seeded-skip-disk")
  }

  specHeaders := make(map[string]string)
  for k, v := range resp.Header() {
    specHeaders[k] = strings.Join(v, ", ")
  }

  if !skipDisk {
    specs := c.loadSpecs()

    newSpec := Spec{
      Key: key,
      SpecResponse: SpecResponse{
        StatusCode:  resp.Code,
        ContentFile: key,
        Headers:     specHeaders,
      },
    }

    specs = append(specs, newSpec)

    contentFilePath := path.Join(c.dataDir, key)
    err := c.FileSystem.WriteFile(contentFilePath, resp.Body.Bytes())
    if err != nil {
      panic(err)
    }

    specBytes, err := json.MarshalIndent(specs, "", "    ")
    err = c.FileSystem.WriteFile(c.specPath, specBytes)
    if err != nil {
      panic(err)
    }
  }

  c.cache[key] = &CachedResponse{
    StatusCode: resp.Code,
    Headers:    specHeaders,
    Body:       resp.Body.Bytes(),
  }

  return c.cache[key]
}
