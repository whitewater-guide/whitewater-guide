package logging

import (
  "os"
  log "github.com/sirupsen/logrus"
)

func ConfigureLogging() {
  logLevelStr := os.Getenv("WORKERS_LOG_LEVEL")
  if logLevelStr == "" {
    logLevelStr = "debug"
  }
  lvl, err := log.ParseLevel(logLevelStr)
  if err != nil {
    lvl = log.DebugLevel
  }
  log.SetLevel(lvl)
  if os.Getenv("WORKERS_LOG_JSON") != "" {
    log.SetFormatter(&log.JSONFormatter{})
  } else {
    log.SetFormatter(&log.TextFormatter{ForceColors: true})
  }
}
