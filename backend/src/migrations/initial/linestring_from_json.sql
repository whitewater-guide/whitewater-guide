CREATE OR REPLACE FUNCTION linestring_from_json(linestring JSON)
  RETURNS GEOGRAPHY(LineStringZ, 4326) AS $$
DECLARE
  point json;
  points text[] := '{}';
BEGIN
  IF linestring IS NULL
  THEN
    RETURN NULL;
  ELSEIF json_array_length(linestring) < 2
  THEN
    RETURN NULL;
  ELSE
    FOR i IN 0..json_array_length(linestring) LOOP
      point := linestring -> i;
      points := array_append(points, (point ->> 0) || ' ' || (point ->> 1) ||  ' ' || (point ->> 2));
    END LOOP;
    RETURN ST_GeomFromText('LINESTRINGZ(' ||  array_to_string(points, ', ') || ')', 4326);
  END IF;
END;
$$ LANGUAGE plpgsql;
