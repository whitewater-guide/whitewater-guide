package quebec

import (
	"core"
	"errors"
	"github.com/antchfx/xquery/html"
	"golang.org/x/text/encoding/charmap"
	"golang.org/x/text/transform"
	"strings"
)

type stationInfo struct {
	code        string
	name        string
	federalCode string
	isLocal     bool
}

func parsePage(code string) (*stationInfo, error) {
	resp, err := core.Client.Get("https://www.cehq.gouv.qc.ca/suivihydro/graphique.asp?NoStation=" + code)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	reader := transform.NewReader(resp.Body, charmap.Windows1252.NewDecoder())
	doc, err := htmlquery.Parse(reader)
	if err != nil {
		return nil, err
	}
	infoTable := htmlquery.FindOne(doc, "//table[@class='tab']/tbody")
	if infoTable == nil {
		return nil, errors.New("could not find info table")
	}
	name := htmlquery.FindOne(infoTable, "/tr/td/font/b[contains(text(),'Nom de la station')]/../../following-sibling::*")
	if name == nil {
		return nil, errors.New("could not find name row")
	}
	fed := htmlquery.FindOne(infoTable, "/tr/td/font/b[contains(text(),'Numéro fédéral')]/../../following-sibling::*")
	if fed == nil {
		return nil, errors.New("could not find federal code row")
	}
	part := htmlquery.FindOne(infoTable, "/tr/td/div/font/b[contains(text(),'Particularité')]/../../..")
	isLocal := true
	if part != nil {
		isLocal = !strings.Contains(htmlquery.InnerText(part), "www.eau.ec.gc.ca")
	}
	return &stationInfo{
		code:        code,
		federalCode: strings.TrimSpace(htmlquery.InnerText(fed)),
		isLocal:     isLocal,
		name:        strings.TrimSpace(htmlquery.InnerText(name)),
	}, nil
}
