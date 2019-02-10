package main

import (
	"core"
	"encoding/json"
	"fmt"
	log "github.com/sirupsen/logrus"
	"net/http"
)

func getPayload(req *http.Request, payload *Payload) error {
	var earlyError string

	if req.URL.Path != endpoint {
		earlyError = "wrong endpoint path " + req.URL.Path
	}
	if req.Method != "POST" {
		earlyError = "only POST is supported"
	}

	decoder := json.NewDecoder(req.Body)
	if err := decoder.Decode(payload); err != nil {
		earlyError = "failed to parse request body"
	}

	if earlyError != "" {
		log.Error(earlyError)
		return fmt.Errorf(earlyError)
	}

	return nil
}

func sendFailure(res http.ResponseWriter, err error) {
	res.WriteHeader(http.StatusBadRequest)
	encoder := json.NewEncoder(res)
	respBody := core.Response{
		Success: false,
		Error:   err.Error(),
	}
	if err := encoder.Encode(respBody); err != nil {
		log.Error("failed to encode result")
	}
}

func getResultCount(result interface{}) int {
	count := 0
	if i, ok := result.(int); ok {
		count = i
	} else if d, ok := result.([]core.Description); ok {
		count = len(d)
	} else if g, ok := result.([]core.GaugeInfo); ok {
		count = len(g)
	}
	return count
}

func sendSuccess(res http.ResponseWriter, err error, result interface{}, logger *log.Entry) {
	count := getResultCount(result)
	var respBody *core.Response
	if err != nil {
		respBody = &core.Response{Success: false, Error: err.Error()}
		logger.WithFields(log.Fields{"error": err}).Error("worker failed")
	} else {
		respBody = &core.Response{Success: true, Data: result}
		logger.WithFields(log.Fields{"count": count}).Debug("success")
	}

	encoder := json.NewEncoder(res)
	if err = encoder.Encode(respBody); err != nil {
		logger.WithError(err).Error("failed to encode result")
	}
}
