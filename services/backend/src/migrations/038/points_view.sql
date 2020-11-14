CREATE OR REPLACE VIEW points_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  )
  SELECT
    points.id,
    points.premium,
    langs.language,
    COALESCE(points_translations.name, default_trans.name, 'Not translated') as name,
    COALESCE(points_translations.description, default_trans.description, 'Not translated') as description,
    points.kind,
    (ST_AsGeoJSON(points.coordinates, 4) :: JSON) AS coordinates
  FROM langs
    CROSS JOIN points
    LEFT OUTER JOIN points_translations
      ON points.id = points_translations.point_id AND points_translations.language = langs.language
    LEFT OUTER JOIN points_translations default_trans
      ON points.id = default_trans.point_id
        AND points.default_lang = default_trans.language
