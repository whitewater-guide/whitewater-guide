CREATE OR REPLACE VIEW points_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  )
  SELECT
    points.id,
    langs.language,
    COALESCE(points_translations.name, 'Not translated') as name,
    COALESCE(points_translations.description, 'Not translated') as description,
    points.kind,
    ST_AsText(points.coordinates) AS coordinates
  FROM langs
    CROSS JOIN points
    LEFT OUTER JOIN points_translations
      ON points.id = points_translations.point_id AND points_translations.language = langs.language