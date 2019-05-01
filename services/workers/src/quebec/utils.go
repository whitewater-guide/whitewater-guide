package quebec

import (
	"fmt"
	"regexp"
	"strconv"
)

func convertDMS(dms string) (float64, error) {
	dmsExp := regexp.MustCompile(`(\d+)°(\d+)'(\d+)"`)
	submatch := dmsExp.FindStringSubmatch(dms)
	if len(submatch) != 4 {
		return 0, fmt.Errorf("incorrect dms expression: %s", dms)
	}
	deg, err := strconv.ParseFloat(submatch[1], 64)
	if err != nil {
		return 0, fmt.Errorf("failed to parse degrees: %v", err)
	}
	min, err := strconv.ParseFloat(submatch[2], 64)
	if err != nil {
		return 0, fmt.Errorf("failed to parse minutes: %v", err)
	}
	sec, err := strconv.ParseFloat(submatch[3], 64)
	if err != nil {
		return 0, fmt.Errorf("failed to parse seconds: %v", err)
	}

	return deg + (min / 60) + (sec / 3600), nil
}
