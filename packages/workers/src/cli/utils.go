package main

import (
  "time"
  "core"
)

func unixHTime(sec int64) core.HTime {
  return core.HTime{time.Unix(sec, 0)}
}

