package main

import (
  "time"
  "github.com/globalsign/mgo/bson"
  "github.com/globalsign/mgo"
  "database/sql"
  "fmt"
  "os"
  "encoding/json"
)

type Token struct {
  AccessToken string `bson:"accessToken" json:"accessToken"`
}

type FacebookProfile struct {
  ID          string `bson:"id" json:"id"`
  Email       string `bson:"email" json:"email"`
  FirstName   string `bson:"first_name" json:"first_name"`
  LastName    string `bson:"last_name" json:"last_name"`
  Link        string `bson:"link" json:"link"`
  Locale      string `bson:"locale" json:"locale"`
}

type Facebook struct {
  FacebookProfile
  Token
  Name        string `bson:"name"`
}

type Services struct {
  Facebook Facebook `bson:"facebook"`
}

type Roles struct {
  GlobalRoles []string `bson:"__global_roles__"`
}

type User struct {
  ID        bson.ObjectId `bson:"_id"`
  CreatedAt time.Time     `bson:"createdAt"`
  Services  Services      `bson:"services"`
  Roles     Roles         `bson:"roles"`
}

func (user User) role() int {
  role := 1
  for _, v := range user.Roles.GlobalRoles {
    if v == "superadmin" {
      return 3
    } else if v == "admin" {
      role = 2
    }
  }
  return role
}

func (user User) token() string {
  bytes, _ := json.Marshal(user.Services.Facebook.Token)
  return string(bytes)
}

func (user User) profile() string {
  bytes, _ := json.Marshal(user.Services.Facebook.FacebookProfile)
  return string(bytes)
}

func insertUsers(mongo *mgo.Database, pg *sql.DB) map[bson.ObjectId]string {
  var userIds = make(map[bson.ObjectId]string)
  var user User
  var userId string
  collection := mongo.C("users")
  iter := collection.Find(nil).Iter()
  for iter.Next(&user) {
    fmt.Println(user.Services.Facebook.ID)
    err := pg.QueryRow(`
      INSERT INTO users(name, avatar, email, role, created_at)
      VALUES($1, $2, $3, $4, $5) RETURNING id
      `, user.Services.Facebook.Name, "NULL", user.Services.Facebook.Email, user.role(), user.CreatedAt).Scan(&userId)
    if err != nil {
      fmt.Fprintf(os.Stderr, "Couldn't insert user %v: %s", user, err.Error())
    }
    _, err = pg.Query(
      "INSERT INTO logins(user_id, provider, id, username, tokens, profile) VALUES ($1, $2, $3, $4, $5, $6)",
      userId, "facebook", user.Services.Facebook.ID, user.Services.Facebook.Name, user.token(), user.profile(),
    )
    if err != nil {
      fmt.Fprintf(os.Stderr, "Couldn't insert login %v: %s", user, err.Error())
    }
    userIds[user.ID] = userId
  }

  if err := iter.Close(); err != nil {
    fmt.Fprintf(os.Stderr, "Couldn't close users iterator: %s", err.Error())
    os.Exit(1)
  }
  return userIds
}
