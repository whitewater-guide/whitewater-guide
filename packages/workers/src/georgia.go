package main

import (
  "core"
  "georgia"
)

func main() {
  worker := georgia.NewWorkerGeorgia()
  core.Init(worker)
  core.Execute()
}
