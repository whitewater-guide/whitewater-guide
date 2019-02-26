package catalunya

import (
	log "github.com/sirupsen/logrus"
	"time"
)

var isFlowSensor map[string]bool
var timezone, tzErr = time.LoadLocation("CET")

func init() {
	if tzErr != nil {
		log.WithError(tzErr).Error("failed to init Catalunya - failed to init tinezone")
		return
	}
	isFlowSensor = make(map[string]bool)
	sensors, err := fetchList()
	if err != nil {
		log.WithError(err).Error("failed to init Catalunya - failed to fetch sensors")
		return
	}
	for _, sensor := range sensors {
		isFlowSensor[sensor.Sensor] = sensor.Type != "0019" // cm is the only level type
	}
	log.WithFields(log.Fields{"sensors": len(isFlowSensor), "timezone": timezone}).Info("Catalunya initialized")
}
