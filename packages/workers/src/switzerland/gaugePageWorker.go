package switzerland

import (
	"core"
	"fmt"
	"github.com/paulmach/orb"
	"github.com/paulmach/orb/project"
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

func parseGaugePage(info *core.GaugeInfo) (loc core.Location, err error) {
	//url := getPageURL(code)
	url := "https://gist.githubusercontent.com/doomsower/df9b9b7655531353a1b07017d157b89a/raw/288beb658506d4a60cc2ad97f6903130785d68e0/station.html"
	raw, err := core.Client.GetAsString(url)
	if err != nil {
		return
	}
	altStart := strings.Index(raw, altOpen)
	raw = raw[altStart+len(altOpen):]
	tdStart := strings.Index(raw, td)
	raw = raw[tdStart+len(td):]
	altEnd := strings.Index(raw, altClose)
	altStr := raw[:altEnd]
	alt, err := strconv.ParseFloat(altStr, 64)
	if err != nil {
		return
	}
	locStart := strings.Index(raw, locOpen)
	raw = raw[locStart+len(locOpen):]
	tdStart = strings.Index(raw, td)
	raw = raw[tdStart+len(td):]
	locEnd := strings.Index(raw, locClose)
	locStr := raw[:locEnd]
	latLon := strings.Split(locStr, " / ")
	if len(latLon) != 2 {
		return core.Location{}, fmt.Errorf("cannot split location")
	}
	x, err := strconv.ParseFloat(latLon[0], 64)
	if err != nil {
		return
	}
	y, err := strconv.ParseFloat(latLon[1], 64)
	if err != nil {
		return
	}
	wgs84 := project.Mercator.ToWGS84(orb.Point{x, y})
	loc = core.Location{
		Altitude:  alt,
		Longitude: wgs84.Lon(),
		Latitude:  wgs84.Lat(),
	}
	return
}
