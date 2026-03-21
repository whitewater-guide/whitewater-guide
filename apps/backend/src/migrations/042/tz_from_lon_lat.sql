-- helper function that returns iana timezone name from longitude and latitude
CREATE OR REPLACE FUNCTION tz_from_lon_lat(lon float, lat float)
  RETURNS TEXT AS $$
DECLARE
  result text;
BEGIN

  SELECT
    tz_geometries.name
  FROM tz_geometries
  WHERE ST_Contains(tz_geometries.geometry, ST_Point(lon, lat))
  LIMIT 1
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
