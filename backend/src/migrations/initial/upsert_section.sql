CREATE OR REPLACE FUNCTION upsert_section(section JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_section_id UUID;
  result              JSON;
BEGIN
  WITH upserted_river AS (
      SELECT upsert_river(section -> 'river', lang) AS river
  ), upserted_section AS (
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
      (SELECT (river ->> 'id') FROM upserted_river) :: UUID,
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
  INSERT INTO sections_translations (section_id, language, name, description, season, flows_text)
    SELECT
      upserted_section.id,
      lang,
      section ->> 'name',
      section ->> 'description',
      section ->> 'season',
      section ->> 'flowsText'
    FROM upserted_section
  ON CONFLICT (section_id, language)
    DO UPDATE SET
      name        = EXCLUDED.name,
      description = EXCLUDED.description,
      season      = EXCLUDED.season,
      flows_text   = EXCLUDED.flows_text
  RETURNING section_id
    INTO upserted_section_id;

  -- return the result
  SELECT to_json(sections_view)
  FROM sections_view
  WHERE id = upserted_section_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
