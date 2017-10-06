CREATE OR REPLACE VIEW gauges_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
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
    COALESCE(gauges_translations.name, 'Not translated') as name
  FROM langs
    CROSS JOIN gauges
    LEFT OUTER JOIN gauges_translations
      ON gauges.id = gauges_translations.gauge_id AND gauges_translations.language = langs.language