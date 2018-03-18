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
  LastValuesNs = "lastValues" // Last timestamp, flow, level per gauge
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
  stats := map[string]interface{} {
    "timestamp": time.Now().UTC().Format(time.RFC3339),
  }
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

func loadLastValues(script, code string) map[core.GaugeId]core.Measurement {
  logger := logrus.WithFields(logrus.Fields{
    "script": script,
    "code": code,
  });
  result := make(map[core.GaugeId]core.Measurement)
  var raws []string
  conn := pool.Get()
  defer conn.Close()
  key := fmt.Sprintf("%s:%s", LastValuesNs, script)
  if code == "" {
    if stringMap, err := redis.StringMap(conn.Do("HGETALL", key)); err == nil {
      raws = make([]string, len(stringMap))
      i := 0
      for _, v := range stringMap {
        raws[i] = v
        i++
      }
    } else if err != redis.ErrNil {
      logger.Errorf("failed to HGETALL: %s", err)
    }
  } else {
    if str, err := redis.String(conn.Do("HGET", key, code)); err == nil {
      raws = []string{str}
    } else if err != redis.ErrNil {
      logger.Errorf("failed to 'HGET %s %s': %s", key, code, err)
    }
  }
  for _, jsonStr := range raws {
    var m core.Measurement
    if err := json.Unmarshal([]byte(jsonStr), &m); err != nil {
      logger.Errorf("failed to unmarshal JSON: %s", err)
    } else {
      result[m.GaugeId] = m
    }
  }
  return result
}

func saveLastValues(values map[core.GaugeId]core.Measurement) {
  conn := pool.Get()
  defer conn.Close()
  var raw []byte

  for id, m := range values {
    raw, _ = json.Marshal(m)
    conn.Send(
      "HSET",
      fmt.Sprintf("%s:%s", LastValuesNs, id.Script),
      id.Code,
      raw,
    )
  }
  if _, err := conn.Do(""); err != nil {
    logrus.Errorf("failed to saveLastValues: %s", err)
  }
}