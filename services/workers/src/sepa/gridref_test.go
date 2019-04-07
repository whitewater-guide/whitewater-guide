package sepa

import (
  "github.com/stretchr/testify/assert"
  "testing"
)

func TestParseGridReg(t *testing.T) {
  assert := assert.New(t)

  result, err := parseGridRef("438700,114800")
  if assert.NoError(err) {
   assert.Equal(gridRef{
     easting:  438700,
     northing: 114800,
   }, result, "438700,114800")
  }

  result, err = parseGridRef("TG 51409 13177")
  if assert.NoError(err) {
   assert.Equal(gridRef{
     easting:  651409,
     northing: 313177,
   }, result, "TG 51409 13177")
  }

  result, err = parseGridRef("TG5140913177")
  if assert.NoError(err) {
   assert.Equal(gridRef{
     easting:  651409,
     northing: 313177,
   }, result, "TG5140913177")
  }

  result, err = parseGridRef("NC3568860107")
  if assert.NoError(err) {
   assert.Equal(gridRef{
     easting:  235688,
     northing: 960107,
   }, result, "NC3568860107")
  }
}
