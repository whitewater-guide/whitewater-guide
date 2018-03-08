package main

import (
  "time"
  "github.com/globalsign/mgo/bson"
  "github.com/globalsign/mgo"
  "database/sql"
  "fmt"
  "encoding/json"
  "github.com/jmoiron/sqlx"
)

type Token struct {
  AccessToken string `bson:"accessToken" json:"accessToken"`
}

type FacebookProfile struct {
  ID        string `bson:"id" json:"id"`
  Email     string `bson:"email" json:"email"`
  FirstName string `bson:"first_name" json:"first_name"`
  LastName  string `bson:"last_name" json:"last_name"`
  Link      string `bson:"link" json:"link"`
  Locale    string `bson:"locale" json:"locale"`
}

type Facebook struct {
  FacebookProfile `bson:",inline"`
  Token           `bson:",inline"`
  Name string     `bson:"name"`
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

func insertUsers(mongo *mgo.Database, pg *sqlx.DB) (IdMap, error) {
  var userIds = make(IdMap)
  var user User
  var userId string
  collection := mongo.C("users")
  userStmt, err := pg.PrepareNamed(`
    INSERT INTO users(name, avatar, email, role, created_at)
    VALUES(:name, :avatar, :email, :role, :created_at) RETURNING id
  `)
  if err != nil {
    return userIds, fmt.Errorf("failed to prepare user statement: %s", err.Error())
  }
  loginStmt, err := pg.PrepareNamed(`
    INSERT INTO logins(user_id, provider, id, username, tokens, profile)
    VALUES (:user_id, :provider, :id, :username, :tokens, :profile)
  `)
  if err != nil {
    return userIds, fmt.Errorf("failed to prepare login statement: %s", err.Error())
  }

  iter := collection.Find(nil).Iter()
  for iter.Next(&user) {
    err := userStmt.QueryRowx(map[string]interface{}{
      "name":       user.Services.Facebook.Name,
      "avatar":     sql.NullString{},
      "email":      user.Services.Facebook.Email,
      "role":       user.role(),
      "created_at": user.CreatedAt,
    }).Scan(&userId)
    if err != nil {
      return userIds, fmt.Errorf("failed to insert user %s: %s", user.ID.Hex(), err.Error())
    }

    _, err = loginStmt.Exec(map[string]interface{}{
      "user_id":  userId,
      "provider": "facebook",
      "id":       user.Services.Facebook.ID,
      "username": user.Services.Facebook.Name,
      "tokens":   user.token(),
      "profile":  user.profile(),
    })
    if err != nil {
      return userIds, fmt.Errorf("couldn't insert login for user %v: %s", user.ID.Hex(), err.Error())
    }
    userIds[user.ID] = userId
  }

  if err := iter.Close(); err != nil {
    return userIds, fmt.Errorf("couldn't close users iterator: %s", err.Error())
  }

  return userIds, nil
}
