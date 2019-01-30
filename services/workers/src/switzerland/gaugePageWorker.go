package switzerland

import (
	"core"
	"strconv"
	"strings"
)

const altOpen = "<th>Station elevation</th>"
const altClose = " m a.s.l."
const td = "<td class=\"text-right\">"
const locOpen = "<th>Station coordinates</th>"
const locClose = "</td>"

func getPageURL(code string) string {
	return "https://www.hydrodaten.admin.ch/en/" + code + ".html"
}

func parseGaugePage(info *core.GaugeInfo) {
	info.Url = getPageURL(info.Code)
	//url := "https://gist.githubusercontent.com/doomsower/df9b9b7655531353a1b07017d157b89a/raw/288beb658506d4a60cc2ad97f6903130785d68e0/station.html"
	raw, err := core.Client.GetAsString(info.Url)
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
	}
	locStart := strings.Index(raw, locOpen)
	raw = raw[locStart+len(locOpen):]
	tdStart = strings.Index(raw, td)
	raw = raw[tdStart+len(td):]
	locEnd := strings.Index(raw, locClose)
	if locEnd == -1 {
		return
	}
	locStr := raw[:locEnd]
	latLon := strings.Split(locStr, " / ")
	if len(latLon) != 2 {
		return
	}
	x, err := strconv.ParseFloat(latLon[0], 64)
	if err != nil {
		return
	}
	y, err := strconv.ParseFloat(latLon[1], 64)
	if err != nil {
		return
	}
	wgs84 := LV03toWGS84(x, y, 0)
	info.Location = core.Location{
		Altitude:  alt,
		Longitude: wgs84[1],
		Latitude:  wgs84[0],
	}
	return
}

func gaugePageWorker(gauges <-chan *core.GaugeInfo, results chan<- struct{}) {
	for gauge := range gauges {
		parseGaugePage(gauge)
		results <- struct{}{}
	}
}
