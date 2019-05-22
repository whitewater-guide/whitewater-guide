package quebec

import (
	"core"
	"errors"
	"fmt"
	"github.com/antchfx/xquery/html"
	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
	"strings"
)

type stationRaw struct {
	code string
	name string
}

func fetchRegion(index int) ([]stationRaw, error) {
	url := fmt.Sprintf("https://www.cehq.gouv.qc.ca/suivihydro/ListeStation.asp?regionhydro=%02d&Tri=Non", index)
	resp, err := core.Client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	reader := transform.NewReader(resp.Body, charmap.Windows1252.NewDecoder())
	doc, err := htmlquery.Parse(reader)
	if err != nil {
		return nil, err
	}
	var result []stationRaw
	for i, tr := range htmlquery.Find(doc, "//table[@id='tblListe']//tr") {
		if i == 0 {
			continue
		}
		trCode := htmlquery.FindOne(tr, "td[1]")
		if trCode == nil {
			return nil, errors.New("cannot find code column")
		}
		code := htmlquery.InnerText(trCode)
		trName := htmlquery.FindOne(tr, "td[2]")
		if trName == nil {
			return nil, errors.New("cannot find name column")
		}
		name := htmlquery.InnerText(trName)
		result = append(result, stationRaw{
			code: strings.TrimSpace(code),
			name: strings.TrimSpace(name),
		})
	}
	return result, nil
}
