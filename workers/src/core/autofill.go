package core

import (
  "github.com/spf13/cobra"
  "fmt"
  "os"
  "encoding/json"
  "github.com/olekukonko/tablewriter"
)

func initAutofill(worker Worker) *cobra.Command {
  return &cobra.Command{
    Use:   "autofill",
    Short: "Returns list of available gauges",
    Run: func(cmd *cobra.Command, args []string) {
      verbose, _ := cmd.Flags().GetBool("verbose")
      autofill(worker, verbose)
    },
  }
}

func autofill(worker Worker, verbose bool) {
  gauges, err := worker.Autofill()
  if err == nil {
    for i := range gauges {
      gauges[i].Script = worker.ScriptName()
    }
  }
  if verbose {
    if err != nil {
      fmt.Printf("Error while autofill: %s", err)
    } else {
      printGauges(gauges)
    }
  } else {
    var resp Response
    if err != nil {
      resp = Response{Success: false, Error: err.Error()}
    } else {
      resp = Response{Success: true, Data: gauges}
    }
    respBytes, e := json.Marshal(resp)
    if e != nil {
      fmt.Fprintf(os.Stderr, "Error while marshaling autofill JSON: %s", e)
      os.Exit(1)
    }
    fmt.Print(string(respBytes))
  }
}

func printGauges(gauges []GaugeInfo) {
  table := tablewriter.NewWriter(os.Stdout)
  table.SetHeader([]string{"#", "Script", "Code", "Url", "LevelUnit", "FlowUnit", "Location", "Name"})
  table.SetBorders(tablewriter.Border{Left: true, Top: false, Right: true, Bottom: false})
  table.SetCenterSeparator("|")
  for i, g := range gauges {
    table.Append([]string{
      fmt.Sprintf("%d", i+1),
      g.Script,
      g.Code,
      g.Name,
      g.LevelUnit,
      g.FlowUnit,
      fmt.Sprintf("%.2f:%.2f:%.1f", g.Location.Latitude, g.Location.Longitude, g.Location.Altitude),
      g.Url,
    })
  }
  table.Render()
}
