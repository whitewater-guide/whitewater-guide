CREATE OR REPLACE VIEW sections_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  )
  SELECT
    sections.id,
    langs.language,
    -- graphql cannot return null for non-nullable field
    -- but if the name hasn't been translated into some language
    -- it will return null
    COALESCE(sections_translations.name, 'Not translated') as name,
    COALESCE(sections_translations.alt_names, '{}'::VARCHAR[]) as alt_names,
    COALESCE(sections_translations.description, 'Not translated') as description,
    COALESCE(sections_translations.season, 'Not translated') as season,
    COALESCE(sections_translations.flows_text, 'Not translated') as flows_text,
    sections.season_numeric,
    sections.levels,
    sections.flows,
    sections.drop,
    sections.distance,
    sections.duration,
    sections.difficulty,
    sections.difficulty_xtra,
    sections.rating,
    ST_AsText(sections.shape) AS shape,
    ST_AsText(st_startpoint(sections.shape :: geometry) :: geography) AS put_in,
    ST_AsText(st_endpoint(sections.shape :: geometry) :: geography) AS take_out,
    sections.created_at,
    sections.updated_at,
    sections.created_by,
    sections.gauge_id,
    sections.river_id,
    (
      SELECT region_id
      FROM rivers
      WHERE rivers.id = sections.river_id
    ) AS region_id,
    (
      SELECT json_agg(points_view.*)
      FROM points_view
        INNER JOIN sections_points ON points_view.id = sections_points.point_id
      WHERE sections_points.section_id = sections.id AND points_view.language = langs.language
    ) AS pois,
    (
      SELECT json_agg(tags_view.*)
      FROM tags_view
        INNER JOIN sections_tags ON tags_view.id = sections_tags.tag_id
      WHERE sections_tags.section_id = sections.id AND tags_view.language = langs.language
    ) AS tags
  FROM langs
    CROSS JOIN sections
    LEFT OUTER JOIN sections_translations
      ON sections.id = sections_translations.section_id
         AND sections_translations.language = langs.language
