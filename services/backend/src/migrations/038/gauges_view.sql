CREATE
OR REPLACE VIEW gauges_view AS WITH langs AS (
  SELECT
    unnest(enum_range(NULL :: language_code)) AS language
)
SELECT
  gauges.id,
  langs.language,
  gauges.source_id,
  gauges.location_id,
  gauges.code,
  gauges.level_unit,
  gauges.flow_unit,
  gauges.request_params,
  gauges.url,
  EXISTS(
    SELECT
      *
    FROM sections
    WHERE
      sections.gauge_id = gauges.id
  ) AS enabled,
  gauges.created_at,
  gauges.updated_at,
  (
    SELECT
      script
    FROM sources
    WHERE
      sources.id = gauges.source_id
  ) as script,
  COALESCE(
    gauges_translations.name,
    default_trans.name,
    'Gauge ' || gauges.code
  ) as name,
  (
    SELECT
      row_to_json(points_view)
    FROM points_view
    WHERE
      points_view.id = gauges.location_id
      AND points_view.language = langs.language
    LIMIT
      1
  ) as location
FROM langs
CROSS JOIN gauges
LEFT OUTER JOIN gauges_translations ON gauges.id = gauges_translations.gauge_id
  AND gauges_translations.language = langs.language
LEFT OUTER JOIN gauges_translations default_trans
        ON gauges.id = default_trans.gauge_id
         AND gauges.default_lang = default_trans.language
