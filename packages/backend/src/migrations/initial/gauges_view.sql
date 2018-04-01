CREATE OR REPLACE VIEW gauges_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
    SELECT * from gauges_translations WHERE language = 'en'
  )
  SELECT
    gauges.id,
    langs.language,
    gauges.source_id,
    gauges.code,
    gauges.level_unit,
    gauges.flow_unit,
    gauges.cron,
    gauges.request_params,
    gauges.url,
    gauges.enabled,
    gauges.created_at,
    gauges.updated_at,
    (SELECT script FROM sources WHERE sources.id = gauges.source_id) as script,
    COALESCE(gauges_translations.name, english.name,  'Gauge ' || gauges.code) as name,
    (
      SELECT row_to_json(sources_view) FROM sources_view
      WHERE sources_view.id = gauges.source_id AND sources_view.language = langs.language
      LIMIT 1
    ) as source,
    (
      SELECT row_to_json(points_view) FROM points_view
      WHERE points_view.id = gauges.location_id AND points_view.language = langs.language
      LIMIT 1
    ) as location
  FROM langs
    CROSS JOIN gauges
    LEFT OUTER JOIN gauges_translations
      ON gauges.id = gauges_translations.gauge_id AND gauges_translations.language = langs.language
    LEFT OUTER JOIN english
      ON english.gauge_id = gauges.id