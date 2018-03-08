CREATE OR REPLACE VIEW regions_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  )
  SELECT
    regions.id,
    langs.language,
    -- graphql cannot return null for non-nullable field
    -- but if the name hasn't been translated into some language
    -- it will return null
    COALESCE(regions_translations.name, 'Not translated') as name,
    regions_translations.description,
    regions_translations.season,
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
