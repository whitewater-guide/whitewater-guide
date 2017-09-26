CREATE TYPE POINT_INPUT AS (
  id          UUID,
  name        VARCHAR(255),
  description TEXT,
  kind        VARCHAR(255),
  coordinates GEOGRAPHY(PointZ, 4326)
)
