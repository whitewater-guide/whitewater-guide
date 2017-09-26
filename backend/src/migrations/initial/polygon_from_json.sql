CREATE OR REPLACE FUNCTION polygon_from_json(polygon JSON)
  RETURNS GEOGRAPHY(PolygonZ, 4326) AS $$
DECLARE
  point json;
  points text[] := '{}';
BEGIN
  IF polygon IS NULL
  THEN
    RETURN NULL;
  ELSEIF json_array_length(polygon) < 3
  THEN
    RETURN NULL;
  ELSE
    FOR i IN 0..json_array_length(polygon) LOOP
      point := polygon -> i;
      points := array_append(points, (point ->> 0) || ' ' || (point ->> 1) ||  ' ' || (point ->> 2));
    END LOOP;
      -- close the polygon
      point := polygon -> 0;
      points := array_append(points, (point ->> 0) || ' ' || (point ->> 1) ||  ' ' || (point ->> 2));
    RETURN ST_GeomFromText('POLYGON Z ((' ||  array_to_string(points, ', ') || '))', 4326);
  END IF;
END;
$$ LANGUAGE plpgsql;
