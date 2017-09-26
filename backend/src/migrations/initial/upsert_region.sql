CREATE OR REPLACE FUNCTION upsert_region(r JSON)
  RETURNS JSON AS $$
DECLARE
  upserted_region_id UUID;
  result             JSON;
  pois               JSON;
BEGIN
  pois := r -> 'pois';

  INSERT INTO regions (id, name, description, season, hidden, season_numeric, bounds)
  VALUES (
    COALESCE((r ->> 'id')::UUID, uuid_generate_v1mc()),
    r ->> 'name',
    r ->> 'description',
    r ->> 'season',
    (r ->> 'hidden')::BOOLEAN,
    array_json_to_int(r -> 'seasonNumeric'),
    polygon_from_json(r -> 'bounds')
  )
  ON CONFLICT (id)
    DO UPDATE SET
      name           = EXCLUDED.name,
      description    = EXCLUDED.description,
      season         = EXCLUDED.season,
      hidden         = EXCLUDED.hidden,
      season_numeric = EXCLUDED.season_numeric,
      bounds         = EXCLUDED.bounds
  RETURNING id
    INTO upserted_region_id;

  -- delete all existing points for this region
  -- points_regions will be deleted by ON DELETE CASCADE
  DELETE FROM points
  WHERE EXISTS(SELECT *
               FROM points_regions
               WHERE points_regions.region_id = upserted_region_id AND
                     points_regions.point_id = points.id);

  IF pois IS NOT NULL
  THEN
    -- now insert all points once again
    WITH new_pois AS (
      INSERT INTO points (id, name, description, kind, coordinates)
        SELECT
          COALESCE((point_json ->> 'id')::UUID, uuid_generate_v1mc()),
          point_json ->> 'name',
          point_json ->> 'description',
          point_json ->> 'kind',
          point_from_json(point_json -> 'coordinates')
        FROM json_array_elements(pois) AS point_json
      RETURNING id
    )
    INSERT INTO points_regions (point_id, region_id)
      SELECT
        new_pois.id,
        upserted_region_id
      FROM new_pois;
  END IF;

  -- return the result
  SELECT json_agg(regions_view)
  FROM regions_view
  WHERE id = upserted_region_id
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
