-- this scripts deletes measurements for which gauge is not linked to any section
DELETE FROM measurements
WHERE
  (script, code) in (
    SELECT
      script,
      code
    FROM gauges
    INNER JOIN sources ON sources.id = gauges.source_id
    WHERE
      NOT EXISTS (
        SELECT
          *
        from sections
        WHERE
          gauge_id = gauges.id
      )
  )
