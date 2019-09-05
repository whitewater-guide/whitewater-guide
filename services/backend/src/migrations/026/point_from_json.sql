CREATE OR REPLACE FUNCTION point_from_json(point JSON)
  RETURNS GEOGRAPHY(PointZ, 4326) AS $$
BEGIN
  IF point IS NULL
  THEN
    RETURN NULL;
  END IF;
  RETURN ST_PointFromText('POINTZ(' || (point ->> 0) || ' ' || (point ->> 1) ||  ' ' || COALESCE((point ->> 2), '0') || ')', 4326);
END;
$$ LANGUAGE plpgsql;
