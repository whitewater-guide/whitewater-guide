package main

import (
  "github.com/spf13/cobra"
  "fmt"
  "os"
  "github.com/olekukonko/tablewriter"
  "github.com/spf13/pflag"
  "core"
)

var codeFlag string
var sinceFlag int64

func initHarvest(worker core.Worker) *cobra.Command {
  cmd := &cobra.Command{
    Use:   worker.ScriptName(),
    Run: func(cmd *cobra.Command, args []string) {
      flags := cmd.Flags()
      harvest(worker, flags)
    },
  }
  cmd.Flags().StringVarP(&codeFlag, "code", "c", "", "Gauge code for one-by-one scripts")
  cmd.Flags().Int64VarP(&sinceFlag, "since", "s", 0, "UNIX timestamp to filter out old measurements")
  return cmd
}

func harvest(worker core.Worker, flags *pflag.FlagSet) {
  code, _ := flags.GetString("code")
  since, _ := flags.GetInt64("since")
  extras := worker.FlagsToExtras(flags)
  measurements, err := worker.Harvest(core.HarvestOptions{Code: code, Since: since, Extras: extras})
  measurements = core.FilterMeasurements(measurements, since)
  if err != nil {
    fmt.Println(err)
  } else {
    printMeasurements(measurements)
  }
}

func printMeasurements(measurements []core.Measurement) {
  table := tablewriter.NewWriter(os.Stdout)
  table.SetHeader([]string{"Script", "Code", "When", "Level", "Flow"})
  table.SetBorders(tablewriter.Border{Left: true, Top: false, Right: true, Bottom: false})
  table.SetCenterSeparator("|")
  table.SetFooter([]string{fmt.Sprintf("%d measurements total", len(measurements)), "", "", "", ""})
  for _, m := range measurements {
    table.Append([]string{
      m.GaugeId.Script,
      m.GaugeId.Code,
      m.Timestamp.UTC().Format("02/01/2006 15:04 MST"),
      fmt.Sprintf("%.2f", m.Level),
      fmt.Sprintf("%.2f", m.Flow),
    })
  }
  table.Render()
}
