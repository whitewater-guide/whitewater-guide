CREATE OR REPLACE FUNCTION upsert_points(points_array JSON, lang language_code)
  RETURNS SETOF UUID AS $$
BEGIN
  -- 1. Convert json to rows
  RETURN QUERY WITH raw_points AS (
      SELECT
        COALESCE((point_json ->> 'id')::UUID, uuid_generate_v1mc()) AS id,
        point_json ->> 'name' AS name,
        point_json ->> 'description' AS description,
        point_json ->> 'kind' AS kind,
        point_from_json(point_json -> 'coordinates') as coordinates,
        lang as default_lang
      FROM json_array_elements(points_array) AS point_json
  ),
  -- 2. Upsert points
  upserted_points AS (
    INSERT INTO points(id, kind, coordinates, default_lang)
      SELECT id, kind, coordinates, default_lang
      FROM raw_points
    ON CONFLICT (id)
      DO UPDATE SET
        kind = EXCLUDED.kind,
        coordinates = EXCLUDED.coordinates
    RETURNING points.*
  )
  -- 3. upsert translations
  INSERT INTO points_translations (point_id, language, name, description)
    SELECT raw_points.id, lang as language, raw_points.name, raw_points.description
    FROM raw_points
  ON CONFLICT (point_id, language)
    DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description
  RETURNING point_id as id;
END;
$$ LANGUAGE plpgsql;
