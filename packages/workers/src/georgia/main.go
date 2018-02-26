package main

import (
  "github.com/doomsower/whitewater/workers/core"
)

func main() {
  georgia := &worker{}
  core.Init(georgia)
  core.Execute()
}
