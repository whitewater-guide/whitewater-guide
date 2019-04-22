package sepa

import (
  "fmt"
  "math"
  "regexp"
  "strconv"
  "strings"
)

type gridRef struct {
  easting int64
  northing int64
}

func padRight(str, pad string, lenght int) string {
  for {
    str += pad
    if len(str) > lenght {
      return str[0:lenght]
    }
  }
}

/**
 * Converted from JS from https://www.movable-type.co.uk/scripts/latlong-os-gridref.html
 *
 * Parses grid reference to OsGridRef object.
 *
 * Accepts standard grid references (eg 'SU 387 148'), with or without whitespace separators, from
 * two-digit references up to 10-digit references (1m × 1m square), or fully numeric comma-separated
 * references in metres (eg '438700,114800').
 *
 * @param   {string}    gridref - Standard format OS grid reference.
 * @returns {OsGridRef} Numeric version of grid reference in metres from false origin (SW corner of
 *   supplied grid square).
 * @throws  {Error}     Invalid grid reference.
 *
 * @example
 *   const grid = OsGridRef.parse('TG 51409 13177'); // grid: { easting: 651409, northing: 313177 }
 */
func parseGridRef(value string) (result gridRef, err error) {
  ref := strings.ToUpper(strings.TrimSpace(value))

  // check for fully numeric comma-separated gridref format
  enRegexp := regexp.MustCompile(`^(\d+),\s*(\d+)$`)
  if match := enRegexp.FindStringSubmatch(ref); match != nil {
    var easting, northing int64
    easting, err = strconv.ParseInt(match[1], 10, 64)
    if err != nil {
      return
    }
    result.easting = easting
    northing, err = strconv.ParseInt(match[2], 10, 64)
    if err != nil {
      return
    }
    result.northing = northing
    return
  }


  // validate format
  grRegexp := regexp.MustCompile(`^[A-Z]{2}\s*[0-9]+\s*[0-9]+$`)
  if !grRegexp.MatchString(ref) {
    err = fmt.Errorf("invalid grid reference: %s", ref)
    return
  }

  // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
  l1 := int64([]rune(ref)[0] - []rune("A")[0])
  l2 := int64([]rune(ref)[1] - []rune("A")[0])
  // shuffle down letters after 'I' since 'I' is not used in grid:
  if l1 > 7 {
    l1 -= 1
  }
  if l2 > 7 {
    l2 -= 1
  }

  // sanity check
  if l1 < 8 || l1 > 18 {
    err = fmt.Errorf("invalid grid reference: %s", ref)
    return
  }

  // convert grid letters into 100km-square indexes from false origin (grid square SV):
  e100km := (((l1 - 2) % 5) * 5 + (l2 % 5)) * 100000
  n100km := ((19 - int64(math.Floor(float64(l1) / 5)) * 5) - int64(math.Floor(float64(l2) / 5))) * 100000

  // skip grid letters to get numeric (easting/northing) part of ref
  en := regexp.MustCompile(`\s+`).Split(strings.TrimSpace(ref[2:]), -1)
  // if e/n not whitespace separated, split half way
  if len(en) == 1 {
    half := int64(float64(len(en[0])) / 2)
    firstHalf := en[0][0: half]
    secondHalf := en[0][half :]
    if len(firstHalf) != len(secondHalf) {
      err = fmt.Errorf("invalid grid reference, odd digits: %s", ref)
      return
    }
    en = []string{firstHalf, secondHalf}
  }

  // standardise to 10-digit refs (metres)
  en[0] = padRight(en[0], "0", 5)
  en[1] = padRight(en[1], "0", 5)
  e, _ := strconv.ParseInt(en[0], 10, 64)
  n, _ := strconv.ParseInt(en[1], 10, 64)
  result = gridRef{
    easting: e100km + e,
    northing: n100km + n,
  }

  return
}
