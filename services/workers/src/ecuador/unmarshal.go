package ecuador

type EcuadorField struct {
  Name     string `json:"name"`
  Type     string `json:"type"`
  Process  string `json:"process"`
  Settable bool   `json:"settable"`
}

type EcuadorHead struct {
  Fields []EcuadorField `json:"fields"`
}

type EcuadorData struct {
  No   int           `json:"no"`
  Time string        `json:"time"`
  Vals []interface{} `json:"vals"`
}

type EcuadorRoot struct {
  Head EcuadorHead   `json:"head"`
  Data []EcuadorData `json:"data"`
  More bool          `json:"more"`
}
