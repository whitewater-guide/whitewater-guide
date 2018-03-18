package main

import (
  "core"
  "github.com/spf13/cobra"
  "norway"
)

func main() {
  worker := norway.NewWorkerNorway()
  cmd := core.Init(worker)
  var harvestCmd cobra.Command
  for _, c := range cmd.Commands() {
    if (*c).Name() == "harvest" {
      harvestCmd = *c
      break
    }
  }
  var versionFlag float64
  var htmlFlag bool
  harvestCmd.Flags().Float64Var(&versionFlag, "version", 1, "Gauge version")
  harvestCmd.Flags().BoolVar(&htmlFlag, "html", false, "Set to true to parse raw HTML instead of json")
  core.Execute()
}
