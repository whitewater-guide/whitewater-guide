package main

import (
  "core"
  "galicia"
)

func main() {
  worker := galicia.NewWorkerGalicia()
  core.Init(worker)
  core.Execute()
}
