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
  "bytes"
  "crypto/md5"
  "encoding/hex"
  "encoding/json"
  "io"
  "io/ioutil"
  "log"
  "net/http"
  "os/exec"
  "strings"
)

// Request embeds an *http.Request to support custom JSON encoding.
type request struct {
  *http.Request
}

type requestURL struct {
  Host     string
  Path     string
  RawQuery string
  Scheme   string
}

type serializedRequest struct {
  BodyBase64    []byte
  ContentLength int64
  Headers       http.Header
  Method        string
  URL           requestURL
}

// A Hasher interface is used to generate a key for a given request.
type Hasher interface {
  Hash(r *http.Request) string
}

// DefaultHasher is the default implementation of a Hasher
type DefaultHasher struct {
}

// Hash returns a hash for a given request.
// The default behavior is to hash the URL, request method and body
// but if the header 'chameleon-no-hash-body' exists, the body
// will not be included in the hash.
func (k DefaultHasher) Hash(r *http.Request) string {
  hasher := md5.New()
  hash := r.URL.RequestURI() + r.Method
  // This method always succeeds
  _, _ = hasher.Write([]byte(hash))

  if r.Body != nil && r.Header.Get("chameleon-no-hash-body") == "" {
    var buf bytes.Buffer
    _, err := buf.ReadFrom(r.Body)
    if err != nil {
      panic(err)
    }
    bufBytes := buf.Bytes()

    _, err = io.Copy(hasher, bytes.NewReader(bufBytes))
    if err != nil {
      panic(err)
    }
    // Put the body back on the request so it can read again
    r.Body = ioutil.NopCloser(bytes.NewReader(bufBytes))
  }

  return hex.EncodeToString(hasher.Sum(nil))
}

// A Commander interface is used to run shell commands.
type Commander interface {
  NewCmd(string, io.Writer, io.Reader) *exec.Cmd
  Run(*exec.Cmd) ([]byte, error)
}

// DefaultCommander is a default implementation of the Commander interface
type DefaultCommander struct {
}

// NewCmd creates a new instance of an *exec.Cmd
func (c DefaultCommander) NewCmd(command string, stderr io.Writer, stdin io.Reader) *exec.Cmd {
  cmd := exec.Command("sh", "-c", command)
  if stderr != nil {
    cmd.Stderr = stderr
  }
  if stdin != nil {
    cmd.Stdin = stdin
  }
  return cmd
}

// Run executes cmd with option STDIN
func (c DefaultCommander) Run(cmd *exec.Cmd) ([]byte, error) {
  out, err := cmd.Output()
  defer func() {
    // If this fails, there isn't much to do
    _ = cmd.Process.Kill()
  }()

  return out, err
}

// CmdHasher is an implementation of a Hasher which uses other commands to generate a hash via STDIN/STDOUT.
type CmdHasher struct {
  Commander
  Command string
}

// MarshalJSON returns a JSON representation of a Request.
// This differs from using the built-in JSON Marshal on an *http.Request
// by embedding the body (base64 encoded), and removing fields that
// aren't important.
func (r *request) MarshalJSON() ([]byte, error) {
  var body bytes.Buffer
  var bodyBytes []byte
  if r.Body != nil {
    _, err := body.ReadFrom(r.Body)
    if err != nil {
      return nil, err
    }
    bodyBytes = body.Bytes()
    r.Body = ioutil.NopCloser(bytes.NewReader(bodyBytes))
  }

  return json.Marshal(serializedRequest{
    BodyBase64:    bodyBytes,
    ContentLength: r.ContentLength,
    Headers:       r.Header,
    Method:        r.Method,
    URL: requestURL{
      Host:     r.URL.Host,
      Path:     r.URL.Path,
      RawQuery: r.URL.RawQuery,
      Scheme:   r.URL.Scheme,
    },
  })
}

// Hash returns a hash for a given request.
// This implementation defers to an external command for a hash and communicates via STDIN/STDOUT.
func (k CmdHasher) Hash(r *http.Request) string {

  encodedReq, err := json.Marshal(&request{r})
  if err != nil {
    panic(err)
  }
  stdin := strings.NewReader(string(encodedReq))

  var stderr bytes.Buffer
  cmd := k.NewCmd(k.Command, &stderr, stdin)
  out, err := k.Run(cmd)

  if err != nil {
    log.Printf("%v:\nSTDOUT:\n%v\n\nSTDERR:\n%v", err, string(out), stderr.String())
    panic(err)
  }

  hasher := md5.New()
  // This method always succeeds
  _, _ = hasher.Write(out)
  return hex.EncodeToString(hasher.Sum(nil))
}
