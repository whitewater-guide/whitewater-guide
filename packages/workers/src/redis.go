package main

import (
  "github.com/gomodule/redigo/redis"
  "time"
  "github.com/sirupsen/logrus"
  "fmt"
  "encoding/json"
  "core"
  "log"
  "os"
)

var pool *redis.Pool
const (
  LastOpNS = "lastOp" // Status of last harvest operation, success, count, error per source and gauge
  LastValuesHash = "lastValues" // Last timestamp, flow, level per gauge
)

func initRedis() {
  redisHost := os.Getenv("REDIS_HOST")
  if redisHost == "" {
    redisHost = "redis"
  }
  redisPort := os.Getenv("REDIS_PORT")
  if redisPort == "" {
    redisPort = "6379"
  }

  pool = &redis.Pool{
    MaxIdle: 3,
    IdleTimeout: 240 * time.Second,
    Dial: func () (redis.Conn, error) {
      conn, err := redis.Dial("tcp", fmt.Sprintf("%s:%s", redisHost, redisPort))
      if err != nil && logrus.GetLevel() == logrus.DebugLevel {
        logger := logrus.New()
        conn = redis.NewLoggingConn(conn, log.New(logger.Writer(), "", 0), "redis")
      }
      return conn, err
    },
  }
  logrus.Infof("redis pool initialized at %s:%s", redisHost, redisPort)
}

func saveOpLog(script, code string, err error, count int) {
  conn := pool.Get()
  defer conn.Close()
  key := fmt.Sprintf("%s:%s", LastOpNS, script)
  stats := make(map[string]interface{})
  if err == nil {
    stats["success"] = true
    stats["count"] = count
  } else {
    stats["success"] = false
    stats["error"] = err.Error()
  }
  bytes, e := json.Marshal(stats)
  if e != nil {
    logrus.WithFields(logrus.Fields{
      "script": script,
      "code": code,
      "error": e.Error(),
      "count": count,
    }).Warn("failed to write redis last op")
    return
  }

  if code == "" { // All-at-once script
    conn.Do("SET", key, string(bytes))
  } else { // One-by-one script
    conn.Do("HSET", key, code, string(bytes))
  }
}

//func getLastValues(script, code string) map[core.GaugeId]core.Measurement {
//  result := make(map[core.GaugeId]core.Measurement)
//  conn := pool.Get()
//  defer conn.Close()
//  if code == "" { // All-at-once
//    reply, err := redis.Values(conn.Do("HGETALL", fmt.Sprintf("%s:%s", LastValNS, script)))
//  } else { // One-by-one
//    reply, err := conn.Do("HGET", fmt.Sprintf("%s:%s", LastValNS, script), code)
//  }
//}

func saveLastValue(measurement core.Measurement) {
  conn := pool.Get()
  defer conn.Close()
  mb, _ := json.Marshal(measurement)

  conn.Do(
    "HSET",
    LastValuesHash,
    fmt.Sprintf("%s:%s", measurement.Script, measurement.Code),
    mb,
  )
}