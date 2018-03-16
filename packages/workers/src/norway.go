package main

/**
 * Take a look at senorge.no, NVEs portal for time series data.
 * Choose a theme, for instance «Vann».
 * Then on the right site, choose the menu “Stasjoner” and then “Vannstand”.
 * Click on a station (dot) on the map and time series plot will pop up.
 * At the bottom of this plot, you can choose to download the data in three formats; text, xml or json.*
 * The url is something like:
 * http://h-web01.nve.no/chartserver/ShowData.aspx?req=getchart&ver=1.0&vfmt=json&time=20160825T0000;20160923T0000&chd=ds=htsr,da=29,id=73.2.0.1000.2,rt=0,mth=inst*
 * Some notes about parameters:
 * • Time=<start>;<end>
 *    o Time period, which are specified as
 *      • exact date time
 *      • relative date time (as c# timespan)
 * • chd=ds=…|ds=…|ds==
 *    o Specify one or more time series to be used (chd means chart data, ds means data source)
 *    o Look at the url when hoovering over various stations.
 * • Id=<digit>.<digit>.<digit>.<digit>.<digit>
 *    o A 5 digit time series id. Digit no 4 should be 1000 for stage and 1001 for discharge*
 *
 * A note of the time attribute (Relative to current timestamp).
 * If you would like to have the last hour of data: time=-1:0;0, the last 6 hours: time=-6:0;0, the last day: time=-1;0
 * Time=-1:0;0  means DateTime.Now.Add(TimeSpan.Parse("-1:0")) or DateTime.Now.AddHour(-1)
 *
 * We do not have a public api for getting all available stations or time series.
 * You better use http://www2.nve.no/h/hd/plotreal/H/list.html to get a list of available stations. (by level)
 * http://www2.nve.no/h/hd/plotreal/Q/list.html (by flow)
 * In order to use the time series data, the origin of the data (NVE) must be visible in the app.
 *
 * Our stations has identity the first three digits, like 62.10,0.
 * Digit number four is the parameter; 1000 for stage, 1001 for discharge
 * Digit number 5 is a version number. Once in a while something changes at station requiring us to upgrade the version number to distinguish to various series.
 * That what’s happened here.
 *
 * The id=62.10.0.1000.1 must be id=62.0.1000.2.
 * The plotreal is based on version 2.
 *
 * So how can you figure out what version is being used?
 * It is not mentioned in plotreal because the version id confuse people.
 * If you go to xgeo.no, search for 62.10.0 you will find the station. Enable viewing vannstand (stage) and click on the point to show the graph,
 * On the left side of the graph you are able to see the versjon (version).
 **/

import (
  "core"
  "github.com/spf13/cobra"
  "norway"
)

func main() {
  worker := norway.NewWorkerNorway()
  cmd := core.Init(worker)
  var harvestCmd cobra.Command
  for _, c := range cmd.Commands() {
    if (*c).Name() == "harvest" {
      harvestCmd = *c
      break
    }
  }
  var versionFlag int
  var htmlFlag bool
  harvestCmd.Flags().IntVar(&versionFlag, "version", 1, "Gauge version")
  harvestCmd.Flags().BoolVar(&htmlFlag, "html", false, "Set to true to parse raw HTML instead of json")
  core.Execute()
}
