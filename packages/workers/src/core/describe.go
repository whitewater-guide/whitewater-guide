package core

import (
  "fmt"
  "github.com/spf13/cobra"
)

func initDescribe(worker Worker) *cobra.Command {
  return &cobra.Command{
    Use:   "describe",
    Short: "Returns script name and harvest mode",
    Long:  "Returns script name and harvest mode",
    Run: func(cmd *cobra.Command, args []string) {
      describe(worker)
    },
  }
}

func describe(worker Worker) {
  mode := worker.HarvestMode()
  fmt.Printf("Script '%s', harvest mode '%s'", worker.ScriptName(), mode)
}
