CREATE OR REPLACE VIEW regions_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
      SELECT * from regions_translations WHERE language = 'en'
  )
  SELECT
    regions.id,
    langs.language,
    COALESCE(regions_translations.name, english.name, 'Not translated') as name,
    COALESCE(regions_translations.description, english.description) as description,
    COALESCE(regions_translations.season, english.season) as season,
    regions.season_numeric,
    regions.hidden,
    regions.created_at,
    regions.updated_at,
    ST_AsText(regions.bounds) AS bounds,
    (
      SELECT json_agg(points_view.*)
      FROM points_view
        INNER JOIN regions_points ON points_view.id = regions_points.point_id
      WHERE regions_points.region_id = regions.id AND points_view.language = langs.language
    ) AS pois
  FROM langs
    CROSS JOIN regions
    LEFT OUTER JOIN regions_translations
      ON regions.id = regions_translations.region_id
         AND regions_translations.language = langs.language
    LEFT OUTER JOIN english
      ON regions.id = english.region_id
