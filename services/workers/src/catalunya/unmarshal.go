package catalunya

import "time"

type CTime struct {
	time.Time
}

func (self *CTime) UnmarshalJSON(b []byte) (err error) {
	t, err := time.ParseInLocation(`"02/01/2006T15:04:05"`, string(b), timezone)
	self.Time = t.UTC()
	return
}

type AdditionalInfo struct {
	TempsMostreigMin string `json:"Temps mostreig (min)"`
	RangMNim         string `json:"Rang mínim"`
	RangMXim         string `json:"Rang màxim"`
}

type ComponentAdditionalInfo struct {
	Comarca                string `json:"Comarca"`
	Provincia              string `json:"Província"`
	Riu                    string `json:"Riu"`
	DistricteFluvial       string `json:"Districte fluvial"`
	Subconca               string `json:"Subconca"`
	TermeMunicipal         string `json:"Terme municipal"`
	SuperficieConcaDrenada string `json:"Superfície conca drenada"`
	Conca                  string `json:"Conca"`
}

type ComponentTechnicalDetails struct {
	Producer     string `json:"producer"`
	Model        string `json:"model"`
	SerialNumber string `json:"serialNumber"`
	MacAddress   string `json:"macAddress"`
	Energy       string `json:"energy"`
	Connectivity string `json:"connectivity"`
}

type Sensor struct {
	Sensor                    string                    `json:"sensor"`
	Description               string                    `json:"description"`
	DataType                  string                    `json:"dataType"`
	Location                  string                    `json:"location"`
	Type                      string                    `json:"type"`
	Unit                      string                    `json:"unit"`
	TimeZone                  string                    `json:"timeZone"`
	PublicAccess              bool                      `json:"publicAccess"`
	Component                 string                    `json:"component"`
	ComponentType             string                    `json:"componentType"`
	ComponentDesc             string                    `json:"componentDesc"`
	ComponentPublicAccess     bool                      `json:"componentPublicAccess"`
	AdditionalInfo            AdditionalInfo            `json:"additionalInfo"`
	ComponentAdditionalInfo   ComponentAdditionalInfo   `json:"componentAdditionalInfo"`
	ComponentTechnicalDetails ComponentTechnicalDetails `json:"componentTechnicalDetails"`
}

type Provider struct {
	Provider   string   `json:"provider"`
	Permission string   `json:"permission"`
	Sensors    []Sensor `json:"sensors"`
}

type Observation struct {
	Value     float64 `json:"value,string"`
	Timestamp CTime   `json:"timestamp"`
	Location  string  `json:"location"`
}

type DataSensor struct {
	Sensor       string        `json:"sensor"`
	Observations []Observation `json:"observations"`
}

type CatalunyaList struct {
	Providers []Provider `json:"providers"`
}

type CatalunyaData struct {
	Sensors []DataSensor `json:"sensors"`
}
