package main

import (
  "core"
  "galicia2"
)

func main() {
  worker := galicia2.NewWorkerGalicia2()
  core.Init(worker)
  core.Execute()
}
