package quebec

import (
	"core"
	"github.com/antchfx/xquery/html"
	"strings"
)

func getCodes() ([]string, error) {
	resp, err := core.Client.Get("https://www.cehq.gouv.qc.ca/suivihydro/default.asp#region")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	doc, err := htmlquery.Parse(resp.Body)
	if err != nil {
		return nil, err
	}
	var result []string
	for _, opt := range htmlquery.Find(doc, "//select[@id='lstStation']/option[@value]") {
		val := htmlquery.SelectAttr(opt, "value")
		result = append(result, strings.TrimSpace(val))
	}
	return result, nil
}
