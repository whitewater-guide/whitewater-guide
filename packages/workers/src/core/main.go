package core

import (
  "github.com/spf13/cobra"
  "fmt"
  "os"
)

var rootCmd *cobra.Command

func Init(worker Worker) *cobra.Command {
  rootCmd = &cobra.Command{
    Use:   worker.ScriptName(),
    Short: "Gauge harvester script '" + worker.ScriptName() + "'",
  }
  rootCmd.AddCommand(
    initAutofill(worker),
    initDescribe(worker),
    initHarvest(worker),
  )
  return rootCmd
}

func Execute() {
  if err := rootCmd.Execute(); err != nil {
    fmt.Fprintf(os.Stderr, "Cobra error: %s", err)
    os.Exit(1)
  }
}
