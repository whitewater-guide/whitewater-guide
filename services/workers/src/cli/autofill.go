package main

import (
	"core"
	"fmt"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"os"
)

func initAutofill(worker core.Worker) *cobra.Command {
	return &cobra.Command{
		Use: worker.ScriptName(),
		Run: func(cmd *cobra.Command, args []string) {
			flags := cmd.Flags()
			autofill(worker, flags)
		},
	}
}

func autofill(worker core.Worker, flags *pflag.FlagSet) {
	extras := worker.FlagsToExtras(flags)
	gauges, err := worker.Autofill(extras)
	if err != nil {
		fmt.Printf("Error while autofill: %s", err)
	} else {
		printGauges(gauges)
	}
}

func printGauges(gauges []core.GaugeInfo) {
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
