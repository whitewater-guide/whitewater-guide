package main

import (
  "core"
  "github.com/spf13/cobra"
)

func main()  {
  w := &worker{}
  cmd := core.Init(w)
  var harvestCmd cobra.Command
  for _, c := range cmd.Commands() {
    if (*c).Name() == "harvest" {
      harvestCmd = *c
      break
    }
  }
  var valueFlag float64
  var minFlag float64
  var maxFlag float64
  harvestCmd.Flags().Float64Var(&valueFlag, "value", 0, "Set this to return fixed value. Has priority over min/max.")
  harvestCmd.Flags().Float64Var(&minFlag, "min", 10, "Set this and max to return random values within interval")
  harvestCmd.Flags().Float64Var(&maxFlag, "max", 20, "Set this and min to return random values within interval")
  core.Execute()
}
