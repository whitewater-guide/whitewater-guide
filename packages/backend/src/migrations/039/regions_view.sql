CREATE OR REPLACE VIEW regions_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
)
  SELECT
    regions.id,
    langs.language,
    COALESCE(regions_translations.name, eng.name, default_trans.name, 'Not translated') as name,
    COALESCE(regions_translations.description, eng.description, default_trans.description) as description,
    COALESCE(regions_translations.season, eng.season, default_trans.season) as season,
    COALESCE(regions_translations.copyright, eng.copyright, default_trans.copyright) as copyright,
    regions.license,
    regions.season_numeric,
    regions.hidden,
    regions.premium,
    regions.sku,
    regions.cover_image,
    regions.maps_size,
    regions.created_at,
    regions.updated_at,
    (ST_AsGeoJSON(regions.bounds, 2) :: json) AS bounds,
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
    LEFT OUTER JOIN regions_translations default_trans
        ON regions.id = default_trans.region_id
         AND regions.default_lang = default_trans.language
    LEFT OUTER JOIN regions_translations eng
        ON regions.id = eng.region_id
         AND eng.language = 'en'
