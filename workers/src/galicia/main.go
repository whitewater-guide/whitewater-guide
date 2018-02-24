package main

import (
  "core"
)

func main() {
  galicia := &worker{}
  core.Init(galicia)
  core.Execute()
}
