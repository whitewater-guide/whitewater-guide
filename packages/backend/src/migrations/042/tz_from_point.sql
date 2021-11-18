-- helper function that returns iana timezone name from geojson with point
CREATE OR REPLACE FUNCTION tz_from_point(point JSON)
  RETURNS TEXT AS $$
DECLARE
BEGIN
  IF point IS NULL
  THEN
    RETURN NULL;
  END IF;

  RETURN tz_from_lon_lat((point -> 'coordinates' ->> 0) :: float, (point -> 'coordinates' ->> 1) :: float);
END;
$$ LANGUAGE plpgsql;
