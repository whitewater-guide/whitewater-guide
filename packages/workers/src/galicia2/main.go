package main

import (
  "github.com/doomsower/whitewater/workers/core"
)

func main() {
  galicia := &worker{}
  core.Init(galicia)
  core.Execute()
}
