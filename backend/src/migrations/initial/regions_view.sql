CREATE OR REPLACE VIEW regions_view AS
  SELECT
    regions.id,
    regions_translations.language,
    regions_translations.name,
    regions_translations.description,
    regions_translations.season,
    regions.season_numeric,
    regions.hidden,
    regions.created_at,
    regions.updated_at,
    ST_AsText(regions.bounds) AS bounds,
    (
      SELECT json_agg(json_build_object(
                          'id', points_view.id,
                          'name', points_view.name,
                          'description', points_view.description,
                          'kind', points_view.kind,
                          'coordinates', ST_AsText(points_view.coordinates)
                      ))
      FROM points_view
        INNER JOIN regions_points ON points_view.id = regions_points.point_id
      WHERE regions_points.region_id = regions.id AND points_view.language = regions_translations.language
    ) AS pois
  FROM regions
    INNER JOIN regions_translations ON regions.id = regions_translations.region_id
