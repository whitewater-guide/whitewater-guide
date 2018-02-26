package core

import (
  "github.com/spf13/cobra"
  "fmt"
  "encoding/json"
  "os"
  "sort"
  "github.com/olekukonko/tablewriter"
  "github.com/spf13/pflag"
)

// Gauge code + timestamp uniquely identifies measurement
type MKey struct {
  code      string
  timestamp HTime
}

var codeFlag string
var sinceFlag int64

func initHarvest(worker Worker) *cobra.Command {
  cmd := &cobra.Command{
    Use:   "harvest",
    Short: "Returns script name and harvest mode",
    Run: func(cmd *cobra.Command, args []string) {
      flags := cmd.Flags()
      verbose, _ := flags.GetBool("verbose")
      harvest(worker, verbose, flags)
    },
  }
  cmd.Flags().StringVarP(&codeFlag, "code", "c", "", "Gauge code for one-by-one scripts")
  cmd.Flags().Int64VarP(&sinceFlag, "since", "s", 0, "UNIX timestamp to filter out old measurements")
  return cmd
}

func harvest(worker Worker, verbose bool, flags *pflag.FlagSet) {
  code, _ := flags.GetString("code")
  since, _ := flags.GetInt64("since")
  measurements, err := worker.Harvest(code, since, flags)
  measurements = filterMeasurements(measurements, since, worker.ScriptName())
  if verbose {
    if err != nil {
      fmt.Println(err)
    } else {
      printMeasurements(measurements)
    }
  } else {
    var resp *Response
    if err != nil {
      resp = &Response{Success: false, Error: err.Error()}
    } else {
      resp = &Response{Success: true, Data: measurements}
    }
    respBytes, e := json.Marshal(resp)
    if e != nil {
      fmt.Fprintf(os.Stderr, "Error while marshaling harvest JSON: %s", e)
      os.Exit(1)
    }
    fmt.Print(string(respBytes))
  }
}

func filterMeasurements(measurements []Measurement, since int64, scriptName string) []Measurement {
  l := len(measurements)
  seen := make(map[MKey]struct{}, l)
  result := make([]Measurement, 0)
  for _, m := range measurements {
    // Omit measurements where both flow and level are 0
    // Omit measurements that are too old
    if (m.Flow == 0.0 && m.Level == 0.0) || (m.Timestamp.Unix() <= since) {
      continue
    }
    // Filter measurement by unique (code:timestamp) pair
    key := MKey{m.Code, m.Timestamp}
    if _, ok := seen[key]; ok {
      continue
    }
    seen[key] = struct{}{}
    // Result is sorted by date, inset into sorted slice
    insertAt := sort.Search(
      len(result),
      func(i int) bool { return result[i].Timestamp.Unix() > m.Timestamp.Unix() },
    )
    result = append(result, Measurement{})
    copy(result[insertAt+1:], result[insertAt:])
    m.Script = scriptName
    result[insertAt] = m
  }
  return result
}

func printMeasurements(measurements []Measurement) {
  table := tablewriter.NewWriter(os.Stdout)
  table.SetHeader([]string{"Script", "Code", "When", "Level", "Flow"})
  table.SetBorders(tablewriter.Border{Left: true, Top: false, Right: true, Bottom: false})
  table.SetCenterSeparator("|")
  table.SetFooter([]string{fmt.Sprintf("%d measurements total", len(measurements)), "", "", "", ""})
  for _, m := range measurements {
    table.Append([]string{
      m.GaugeId.Script,
      m.GaugeId.Code,
      fmt.Sprintf("%d", m.Timestamp.Unix()),
      fmt.Sprintf("%.2f", m.Level),
      fmt.Sprintf("%.2f", m.Flow),
    })
  }
  table.Render()
}
