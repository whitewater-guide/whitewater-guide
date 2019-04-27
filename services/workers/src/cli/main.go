package main

import (
	"all-at-once"
	"canada"
	"cantabria"
	"catalunya"
	"chile"
	"core"
	"ecuador"
	"fmt"
	"galicia"
	"galicia2"
	"georgia"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"logging"
	"norway"
	"one-by-one"
	"os"
	"riverzone"
	"sepa"
	"strings"
	"switzerland"
	"tirol"
)

var (
	rootCmd         *cobra.Command
	workerFactories = make(map[string]core.WorkerFactory)
	harvestFlags    = make(map[string]func(cmd *cobra.Command))
)

func register(factory core.WorkerFactory, flags func(cmd *cobra.Command)) {
	worker := factory()
	name := worker.ScriptName()
	workerFactories[name] = factory
	harvestFlags[name] = flags
}

func main() {
	logging.ConfigureLogging()
	if core.Client == nil {
		log.Fatal("failed to initialize http client")
		return
	}

	register(all_at_once.NewWorkerAllAtOnce, func(cmd *cobra.Command) {
		cmd.Flags().Float64("value", 0, "Set this to return fixed value. Has priority over min/max.")
		cmd.Flags().Float64("min", 10, "Set this and max to return random values within interval")
		cmd.Flags().Float64("max", 20, "Set this and min to return random values within interval")
	})
	register(galicia.NewWorkerGalicia, nil)
	register(galicia2.NewWorkerGalicia2, nil)
	register(georgia.NewWorkerGeorgia, nil)
	register(norway.NewWorkerNorway, func(cmd *cobra.Command) {
		cmd.Flags().Float64("version", 1, "Gauge version")
		cmd.Flags().Bool("html", false, "Set to true to parse raw HTML instead of json")
	})
	register(one_by_one.NewWorkerOneByOne, func(cmd *cobra.Command) {
		cmd.Flags().Float64("value", 0, "Set this to return fixed value. Has priority over min/max.")
		cmd.Flags().Float64("min", 10, "Set this and max to return random values within interval")
		cmd.Flags().Float64("max", 20, "Set this and min to return random values within interval")
	})
	register(riverzone.NewWorkerRiverzone, nil)
	register(chile.NewWorkerChile, nil)
	register(tirol.NewWorkerTirol, nil)
	register(switzerland.NewWorkerSwitzerland, nil)
	register(ecuador.NewWorkerEcuador, nil)
	register(catalunya.NewWorkerCatalunya, nil)
	register(cantabria.NewWorkerCantabria, nil)
	register(sepa.NewWorkerSepa, nil)
	register(canada.NewWorkerCanada, func(cmd *cobra.Command) {
		cmd.Flags().String("province", "", "Set province/territory")
	})

	rootCmd = &cobra.Command{
		Use:   "workers-cli [command] [script] [flags]",
		Short: "Human-friendly workers cli",
	}
	template := rootCmd.UsageTemplate()
	cmdTemplate := strings.Replace(template, "Available Commands:", "Available scripts:", 1)

	autofill := &cobra.Command{
		Use:   "autofill [script]",
		Short: "Prints all available gauges",
	}
	autofill.SetUsageTemplate(cmdTemplate)
	harvest := &cobra.Command{
		Use:   "harvest [script]",
		Short: "Prints latest measurements",
	}
	harvest.SetUsageTemplate(cmdTemplate)
	describe := &cobra.Command{
		Use:   "describe [script]",
		Short: "Prints worker name and harvest mode",
	}
	describe.SetUsageTemplate(cmdTemplate)
	for name, factory := range workerFactories {
		worker := factory()
		addFlags := harvestFlags[name]
		harvestCmd := initHarvest(worker)
		if addFlags != nil {
			addFlags(harvestCmd)
		}
		autofillCmd := initAutofill(worker)
		if addFlags != nil {
			addFlags(autofillCmd)
		}

		describe.AddCommand(initDescribe(worker))
		autofill.AddCommand(autofillCmd)
		harvest.AddCommand(harvestCmd)
	}

	rootCmd.AddCommand(
		autofill,
		harvest,
		describe,
	)

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Cobra error: %s", err)
		os.Exit(1)
	}
}
