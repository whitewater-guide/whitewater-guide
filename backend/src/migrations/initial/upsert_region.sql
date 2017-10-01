CREATE OR REPLACE FUNCTION upsert_region(r JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_region_id UUID;
  result             JSON;
  pois               JSON;
  point_ids          UUID[] := '{}'::UUID[];
BEGIN
  pois := r -> 'pois';

  -- First, insert common region data into regions table
  WITH upserted_region AS (
    INSERT INTO regions (id, hidden, season_numeric, bounds)
    VALUES (
      COALESCE((r ->> 'id') :: UUID, uuid_generate_v1mc()),
      (r ->> 'hidden') :: BOOLEAN,
      array_json_to_int(r -> 'seasonNumeric'),
      polygon_from_json(r -> 'bounds')
    )
    ON CONFLICT (id)
      DO UPDATE SET
        hidden         = EXCLUDED.hidden,
        season_numeric = EXCLUDED.season_numeric,
        bounds         = EXCLUDED.bounds
    RETURNING id
  )
  -- Then insert translations
  INSERT INTO regions_translations (region_id, language, name, description, season)
    SELECT
      upserted_region.id as region_id,
      lang as language,
      r ->> 'name' as name,
      r ->> 'description' as description,
      r ->> 'season' as season
    FROM upserted_region
  ON CONFLICT (region_id, language)
    DO UPDATE SET
      name        = EXCLUDED.name,
      description = EXCLUDED.description,
      season      = EXCLUDED.season
  RETURNING region_id
    INTO upserted_region_id;

  IF pois IS NOT NULL
  THEN
    -- now insert all points once again
    WITH new_pois AS (
        SELECT upsert_points(pois, lang) as id
    ), inserted_points AS (
      INSERT INTO regions_points (point_id, region_id)
        SELECT
          new_pois.id,
          upserted_region_id
        FROM new_pois
      ON CONFLICT (point_id, region_id)
        DO UPDATE SET
          point_id = EXCLUDED.point_id,
          region_id = EXCLUDED.region_id
      RETURNING point_id
    )
    SELECT array_agg ( point_id )
    FROM inserted_points
    INTO point_ids;
  END IF;

  -- delete all existing points for this region
  -- regions_points will be deleted by ON DELETE CASCADE
  -- points_translations will be deleted by ON DELETE CASCADE
  DELETE FROM points
  WHERE EXISTS(SELECT *
               FROM regions_points
               WHERE regions_points.region_id = upserted_region_id AND
                     regions_points.point_id = points.id AND
                     NOT(regions_points.point_id = ANY(point_ids))
  );

  -- return the result
  SELECT json_agg(regions_view)
  FROM regions_view
  WHERE id = upserted_region_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
