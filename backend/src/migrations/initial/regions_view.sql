CREATE OR REPLACE VIEW regions_view AS
  SELECT
    regions.id,
    regions.name,
    regions.description,
    regions.season,
    regions.season_numeric,
    regions.hidden,
    regions.created_at,
    regions.updated_at,
    ST_AsText(regions.bounds)          AS bounds,
    json_agg(json_build_object(
                 'id', points.id,
                 'name', points.name,
                 'description', points.description,
                 'kind', points.kind,
                 'coordinates', ST_AsText(points.coordinates)
             ))
      FILTER (WHERE points.id NOTNULL) AS pois
  FROM regions
    LEFT OUTER JOIN points_regions ON regions.id = points_regions.region_id
    LEFT OUTER JOIN points ON points_regions.point_id = points.id
  GROUP BY regions.id
