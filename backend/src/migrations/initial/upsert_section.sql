CREATE OR REPLACE FUNCTION upsert_section(section JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_section_id UUID;
  result              JSON;
  pois               JSON;
  point_ids          UUID[] := '{}'::UUID[];
BEGIN
  pois := section -> 'pois';

  WITH upserted_section AS (
    INSERT INTO sections (
      id,
      river_id,
      gauge_id,
      season_numeric,
      levels,
      flows,
      shape,
      distance,
      "drop",
      duration,
      difficulty,
      difficulty_xtra,
      rating
    )
    VALUES (
      COALESCE((section ->> 'id') :: UUID, uuid_generate_v1mc()),
      ((section -> 'river') ->> 'id') :: UUID,
      (section -> 'gauge' ->> 'id') :: UUID,
      COALESCE(array_json_to_int(section -> 'seasonNumeric'), '{}' :: INTEGER []),
      section -> 'levels',
      section -> 'flows',
      linestring_from_json(section -> 'shape'),
      (section ->> 'distance') :: real,
      (section ->> 'drop') :: real,
      (section ->> 'duration') :: integer,
      (section ->> 'difficulty') :: real,
      section ->> 'difficultyXtra',
      (section ->> 'rating') :: real
    )
    ON CONFLICT (id)
      DO UPDATE SET
        river_id        = EXCLUDED.river_id,
        gauge_id        = EXCLUDED.gauge_id,
        season_numeric  = EXCLUDED.season_numeric,
        levels          = EXCLUDED.levels,
        flows           = EXCLUDED.flows,
        shape           = EXCLUDED.shape,
        distance        = EXCLUDED.distance,
        "drop"          = EXCLUDED."drop",
        duration        = EXCLUDED.duration,
        difficulty      = EXCLUDED.difficulty,
        difficulty_xtra = EXCLUDED.difficulty_xtra,
        rating          = EXCLUDED.rating
    RETURNING id
  )
  INSERT INTO sections_translations (section_id, language, name, alt_names, description, season, flows_text)
    SELECT
      upserted_section.id,
      lang,
      section ->> 'name',
      CASE
        WHEN (section ->> 'altNames') IS NULL
          THEN '{}'::VARCHAR[]
          ELSE array_json_to_varchar(section -> 'altNames')
      END,
      section ->> 'description',
      section ->> 'season',
      section ->> 'flowsText'
    FROM upserted_section
  ON CONFLICT (section_id, language)
    DO UPDATE SET
      name        = EXCLUDED.name,
      alt_names   = EXCLUDED.alt_names,
      description = EXCLUDED.description,
      season      = EXCLUDED.season,
      flows_text   = EXCLUDED.flows_text
  RETURNING section_id
    INTO upserted_section_id;

  IF pois IS NOT NULL
  THEN
    -- now insert all points once again
    WITH new_pois AS (
        SELECT upsert_points(pois, lang) as id
    ), inserted_points AS (
      INSERT INTO sections_points (point_id, section_id)
        SELECT
          new_pois.id,
          upserted_section_id
        FROM new_pois
      ON CONFLICT (point_id, section_id) DO NOTHING
      RETURNING point_id
    ), all_points AS (
      SELECT point_id FROM inserted_points -- inserted
      UNION  ALL
      SELECT new_pois.id AS point_id -- not inserted
      FROM new_pois
        INNER JOIN points ON points.id = new_pois.id
    )
    SELECT array_agg(point_id)
    FROM all_points
    INTO point_ids;
  END IF;

  -- delete all existing points for this region
  -- sections_points will be deleted by ON DELETE CASCADE
  -- points_translations will be deleted by ON DELETE CASCADE
  DELETE FROM points
  WHERE EXISTS(SELECT *
               FROM sections_points
               WHERE sections_points.section_id = upserted_section_id AND
                     sections_points.point_id = points.id AND
                     NOT(sections_points.point_id = ANY(point_ids))
  );

  -- return the result
  SELECT to_json(sections_view)
  FROM sections_view
  WHERE id = upserted_section_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
