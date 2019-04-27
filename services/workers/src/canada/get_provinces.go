package canada

import "strings"

const allProvinces = "AB,BC,MB,NB,NL,NS,NT,NU,ON,PE,QC,SK,YT"

func getProvinces(options map[string]interface{}) (result map[string]bool) {
	result = make(map[string]bool)
	provinces := allProvinces
	if prov, ok := options["provinces"].(string); ok && len(prov) > 1 {
		provinces = prov
	}
	codes := strings.Split(provinces, ",")
	for _, v := range codes {
		result[v] = true
	}
	return
}
