CREATE OR REPLACE FUNCTION upsert_gauge(gauge JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_gauge_id  UUID;
  result             JSON;
BEGIN
  -- First, insert location
  WITH upserted_location AS (
    SELECT
      CASE
        WHEN gauge ->> 'location' IS NULL THEN null
        ELSE upsert_points(json_build_array(gauge -> 'location'), lang)
      END AS location_id
  ),
  -- Then insert core
  upserted_gauge AS (
    INSERT INTO gauges(id, source_id, location_id, code, level_unit, flow_unit, cron, request_params, url, enabled)
    SELECT
      COALESCE((gauge ->> 'id') :: UUID, uuid_generate_v1mc()),
      (gauge -> 'source' ->> 'id') :: UUID,
      upserted_location.location_id,
      gauge ->> 'code',
      gauge ->> 'levelUnit',
      gauge ->> 'flowUnit',
      gauge ->> 'cron',
      to_json(gauge ->> 'requestParams'),
      gauge ->> 'url',
      (gauge ->> 'enabled') :: BOOLEAN
    FROM upserted_location
    ON CONFLICT (id)
      DO UPDATE SET
        source_id         = EXCLUDED.source_id,
        location_id       = EXCLUDED.location_id,
        code              = EXCLUDED.code,
        level_unit        = EXCLUDED.level_unit,
        flow_unit         = EXCLUDED.flow_unit,
        cron              = EXCLUDED.cron,
        request_params    = EXCLUDED.request_params,
        url               = EXCLUDED.url,
        enabled           = EXCLUDED.enabled
    RETURNING id
  )
  INSERT INTO gauges_translations(gauge_id, language, name)
    SELECT
      upserted_gauge.id,
      lang,
      gauge ->> 'name'
    FROM upserted_gauge
  ON CONFLICT (gauge_id, language)
    DO UPDATE SET
      name        = EXCLUDED.name
  RETURNING gauge_id
    INTO upserted_gauge_id;

  -- return the result
  SELECT json_agg(gauges_view)
  FROM gauges_view
  WHERE id = upserted_gauge_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
