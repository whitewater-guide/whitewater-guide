CREATE OR REPLACE VIEW points_view AS
  SELECT
    points.id,
    points_translations.language,
    points_translations.name,
    points_translations.description,
    points.kind,
    ST_AsText(points.coordinates) AS coordinates
  FROM points
    INNER JOIN points_translations on points.id = points_translations.point_id
