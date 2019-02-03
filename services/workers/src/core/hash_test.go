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
  "io"
  "net/http"
  "os/exec"
  "strings"
  "testing"
)

type testCommander struct {
  DefaultCommander
  stdin *bytes.Buffer
}

func (c testCommander) NewCmd(command string, stderr io.Writer, stdin io.Reader) *exec.Cmd {
  cmd := c.DefaultCommander.NewCmd(command, stderr, stdin)
  // Copy the STDIN sent to "command" to our bytes.Buffer for inspection later
  cmd.Stdin = io.TeeReader(cmd.Stdin, c.stdin)
  return cmd
}

func TestDefaultHasherExcludesBody(t *testing.T) {
  hasher := DefaultHasher{}

  body := "HASH THIS BODY"
  req, _ := http.NewRequest("POST", "/foobar", strings.NewReader(body))
  req.Header.Set("chameleon-no-hash-body", "true")
  hash := hasher.Hash(req)

  md5Hasher := md5.New()
  md5Hasher.Write([]byte(req.URL.RequestURI() + req.Method))
  expected := hex.EncodeToString(md5Hasher.Sum(nil))
  if hash != expected {
    t.Errorf("Got: `%v`; Expected: `%v`", hash, expected)
  }
}

func TestDefaultHasherIncludesBody(t *testing.T) {
  hasher := DefaultHasher{}

  body := "HASH THIS BODY"
  reqWithHeader, _ := http.NewRequest("POST", "/foobar", strings.NewReader(body))
  reqWithHeader.Header.Set("chameleon-hash-body", "true")
  reqWithoutHeader, _ := http.NewRequest("POST", "/foobar", strings.NewReader(body))
  withHeader := hasher.Hash(reqWithHeader)
  withoutHeader := hasher.Hash(reqWithoutHeader)

  if withoutHeader != withHeader {
    t.Errorf("Request hashes do not match: `%v` != `%v`", withoutHeader, withHeader)
  }
}

func TestCmdHasher(t *testing.T) {
  var stdin bytes.Buffer
  hasher := CmdHasher{Command: "/bin/cat", Commander: testCommander{stdin: &stdin}}
  req, _ := http.NewRequest("POST", "/foobar", strings.NewReader("HASH THIS BODY"))
  req.Header.Set("chameleon-hash-body", "true")
  hash := hasher.Hash(req)

  md5Hasher := md5.New()
  // our command just echoes back what we gave it, so all of stdin should be included in the hash
  md5Hasher.Write(stdin.Bytes())
  expected := hex.EncodeToString(md5Hasher.Sum(nil))
  if hash != expected {
    t.Errorf("Got: `%v`; Expected: `%v`", hash, expected)
  }
}
