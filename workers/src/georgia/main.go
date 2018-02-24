package main

import (
  "core"
)

func main() {
  georgia := &worker{}
  core.Init(georgia)
  core.Execute()
}
