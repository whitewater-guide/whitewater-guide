CREATE OR REPLACE FUNCTION upsert_source(src JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_source_id UUID;
  result             JSON;
BEGIN
  WITH upserted_source AS (
    INSERT INTO sources (id, script, cron, harvest_mode, url)
    VALUES (
      COALESCE((src ->> 'id') :: UUID, uuid_generate_v1mc()),
      src ->> 'script',
      src ->> 'cron',
      src ->> 'harvestMode',
      src ->> 'url'
    )
    ON CONFLICT (id)
      DO UPDATE SET
        script         = EXCLUDED.script,
        cron           = EXCLUDED.cron,
        harvest_mode   = EXCLUDED.harvest_mode,
        url            = EXCLUDED.url
    RETURNING id
  )
  -- Then insert translations
  INSERT INTO sources_translations (source_id, language, name, terms_of_use)
    SELECT
      upserted_source.id as source_id,
      lang as language,
      src ->> 'name' as name,
      src ->> 'termsOfUse' as terms_of_use
    FROM upserted_source
  ON CONFLICT (source_id, language)
    DO UPDATE SET
      name         = EXCLUDED.name,
      terms_of_use = EXCLUDED.terms_of_use
  RETURNING source_id
    INTO upserted_source_id;

  -- delete all existing source -> regions connection for this source
  DELETE FROM sources_regions WHERE source_id = upserted_source_id;
  -- insert regions connections
  INSERT INTO sources_regions(source_id, region_id)
  SELECT upserted_source_id, regions_json.id :: UUID
  FROM json_to_recordset(src -> 'regions') as regions_json(id text);

  -- return the result
  SELECT to_json(sources_view)
  FROM sources_view
  WHERE id = upserted_source_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
