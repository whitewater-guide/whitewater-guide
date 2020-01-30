CREATE
OR REPLACE VIEW jobs_view AS WITH enabled_gauges AS (
  SELECT
    code,
    source_id,
    request_params
  FROM gauges
  WHERE
    EXISTS(
      SELECT
        *
      FROM sections
      WHERE
        sections.gauge_id = gauges.id
    )
)
SELECT
  id,
  cron,
  script,
  request_params,
  (
    SELECT
      json_object_agg(code, request_params)
    FROM enabled_gauges
    WHERE
      enabled_gauges.source_id = sources.id
  ) as gauges
FROM sources
