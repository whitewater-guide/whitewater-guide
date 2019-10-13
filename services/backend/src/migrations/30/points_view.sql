CREATE OR REPLACE VIEW points_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
      SELECT * from points_translations WHERE language = 'en'
  )
  SELECT
    points.id,
    points.premium,
    langs.language,
    COALESCE(points_translations.name, english.name, 'Not translated') as name,
    COALESCE(points_translations.description, english.description, 'Not translated') as description,
    points.kind,
    (ST_AsGeoJSON(ST_QuantizeCoordinates(points.coordinates, 0)) :: JSON) AS coordinates
  FROM langs
    CROSS JOIN points
    LEFT OUTER JOIN points_translations
      ON points.id = points_translations.point_id AND points_translations.language = langs.language
    LEFT OUTER JOIN english
      ON points.id = english.point_id
