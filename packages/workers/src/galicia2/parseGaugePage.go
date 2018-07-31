package galicia2

import (
	"bufio"
	"fmt"
	"github.com/im7mortal/UTM"
	jar "github.com/juju/persistent-cookiejar"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
)

const (
	delim1 = "<!----------------------------------------------------------------------------- LINEA 1 ------------------------------------------------------------------>"
	delim2 = "<!----------------------------------------------------------------------------- LINEA 2 ------------------------------------------------------------------>"
)

// http://saih.chminosil.es/index.php?url=/datos/ficha/estacion:N015
func parseGaugePage(url string) (latitude float64, longitude float64, altitude float64) {
	jarOpts := jar.Options{
		Filename: "galicia2.cookies",
	}
	persJar, err := jar.New(&jarOpts)
	if err != nil {
		return
	}
	client := http.Client{Jar: persJar}
	resp, err := client.Get(url)
	if err != nil {
		return
	}
	defer resp.Body.Close()
	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return
	}
	html := string(bytes)
	bodyInd := strings.Index(html, delim1) + len(delim1)
	bodyEnd := strings.Index(html, delim2)
	html = html[bodyInd:bodyEnd]
	trEnd := strings.Index(html, "</tr>")
	html = html[trEnd+5:]
	trEnd = strings.Index(html, "</tr>")
	html = html[:trEnd+5]

	scanner := bufio.NewScanner(strings.NewReader(html))
	scanner.Split(splitColumns)
	i, coord := 0, [4]float64{}
	for scanner.Scan() {
		coord[i], _ = strconv.ParseFloat(scanner.Text(), 64)
		i++
	}
	altitude = coord[3]
	latitude, longitude, err = UTM.ToLatLon(coord[1], coord[2], int(coord[0]), "", true)
	if err != nil {
		fmt.Println(err)
	}
	return
}
