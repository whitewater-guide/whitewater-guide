CREATE OR REPLACE FUNCTION upsert_river(river JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_river_id  UUID;
  result             JSON;
BEGIN
  -- Then insert core
  WITH upserted_river AS (
    INSERT INTO rivers(id, region_id, created_by, default_lang, import_id)
    VALUES (
      COALESCE((river ->> 'id') :: UUID, uuid_generate_v1mc()),
      (river -> 'region' ->> 'id') :: UUID,
      (river ->> 'createdBy') :: UUID,
      lang,
      river ->> 'importId'
    )
    ON CONFLICT (id)
      DO UPDATE SET
        region_id         = rivers.region_id,
        created_by        = rivers.created_by,
        import_id         = rivers.import_id
    RETURNING id
  )
  INSERT INTO rivers_translations(river_id, language, name, alt_names)
    SELECT
      upserted_river.id,
      lang,
      river ->> 'name',
      CASE
        WHEN (river ->> 'altNames') IS NULL
          THEN '{}'::VARCHAR[]
          ELSE array_json_to_varchar(river -> 'altNames')
      END
    FROM upserted_river
  ON CONFLICT (river_id, language)
    DO UPDATE SET
      name        = EXCLUDED.name,
      alt_names   = EXCLUDED.alt_names
  RETURNING river_id
    INTO upserted_river_id;

  -- return the result
  SELECT to_json(rivers_view)
  FROM rivers_view
  WHERE id = upserted_river_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
