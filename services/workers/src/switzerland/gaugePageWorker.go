package switzerland

import (
	"core"
	"strconv"
	"strings"
)

const altOpen = "<th>Station elevation</th>"
const altClose = " m a.s.l."
const td = "<td class=\"text-right\">"

func parseAltitude(info *core.GaugeInfo) {
	raw, err := core.Client.GetAsString("https://www.hydrodaten.admin.ch/en/" + info.GaugeId.Code + ".html")
	if err != nil {
		return
	}
	altStart := strings.Index(raw, altOpen)
	raw = raw[altStart+len(altOpen):]
	tdStart := strings.Index(raw, td)
	raw = raw[tdStart+len(td):]
	altEnd := strings.Index(raw, altClose)
	var alt float64
	if altEnd != -1 {
		altStr := raw[:altEnd]
		alt, _ = strconv.ParseFloat(altStr, 64)
		info.Location.Altitude = alt
	}
	return
}

func gaugePageWorker(gauges <-chan *core.GaugeInfo, results chan<- struct{}) {
	for gauge := range gauges {
		parseAltitude(gauge)
		results <- struct{}{}
	}
}
