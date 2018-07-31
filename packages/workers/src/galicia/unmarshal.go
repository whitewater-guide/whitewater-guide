package galicia

import "time"

type GTime struct {
	time.Time
}

func (self *GTime) UnmarshalJSON(b []byte) (err error) {
	t, err := time.Parse(`"2006-01-02T15:04:05"`, string(b))
	self.Time = t.UTC()
	return
}

type Medida struct {
	CodParametro int     `json:"codParametro"`
	Unidade      string  `json:"unidade"`
	Valor        float64 `json:"valor"`
}

type Aforo struct {
	DataUTC      GTime    `json:"dataUTC"`
	Ide          int      `json:"ide"`
	Latitude     float64  `json:"latitude,string"`
	Lonxitude    float64  `json:"lonxitude,string"`
	ListaMedidas []Medida `json:"listaMedidas"`
	NomeEstacion string   `json:"nomeEstacion"`
}

type Raw struct {
	ListaAforos []Aforo `json:"listaAforos"`
}
