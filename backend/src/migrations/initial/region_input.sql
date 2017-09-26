CREATE TYPE REGION_INPUT AS (
  id             UUID,
  name           VARCHAR(255),
  description    TEXT,
  season         VARCHAR(255),
  hidden         BOOLEAN,
  season_numeric INTEGER [],
  bounds         GEOGRAPHY(PolygonZ, 4326)
)
