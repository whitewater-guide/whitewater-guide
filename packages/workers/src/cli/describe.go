package main

import (
  "fmt"
  "github.com/spf13/cobra"
  "core"
)

func initDescribe(worker core.Worker) *cobra.Command {
  return &cobra.Command{
    Use:   worker.ScriptName(),
    Run: func(cmd *cobra.Command, args []string) {
      describe(worker)
    },
  }
}

func describe(worker core.Worker) {
  mode := worker.HarvestMode()
  fmt.Printf("Script '%s', harvest mode '%s'", worker.ScriptName(), mode)
}
