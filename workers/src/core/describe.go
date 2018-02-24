package core

import (
  "fmt"
  "github.com/spf13/cobra"
  "encoding/json"
  "os"
)

func initDescribe(worker Worker) *cobra.Command {
  return &cobra.Command{
    Use:   "describe",
    Short: "Returns script name and harvest mode",
    Long:  "Returns script name and harvest mode",
    Run: func(cmd *cobra.Command, args []string) {
      verbose, _ := cmd.Flags().GetBool("verbose")
      describe(worker, verbose)
    },
  }
}

func describe(worker Worker, verbose bool) {
  mode := worker.HarvestMode()
  if verbose {
    fmt.Printf("Script '%s', harvest mode '%s'", worker.ScriptName(), mode)
  } else {
    descrBytes, err := json.Marshal(Description{Name: worker.ScriptName(), Mode: mode})
    if err != nil {
      fmt.Fprintf(os.Stderr, "Error while marshalling result: %s", err)
      os.Exit(1)
    }
    fmt.Print(string(descrBytes))
  }
}
