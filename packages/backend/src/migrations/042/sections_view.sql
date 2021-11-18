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
      COALESCE(sections_translations.name, eng.name, default_trans.name, 'Not translated') as name,
      COALESCE(sections_translations.alt_names, eng.alt_names, default_trans.alt_names, '{}'::VARCHAR[]) as alt_names,
      COALESCE(sections_translations.description, eng.description, default_trans.description) as description,
      COALESCE(sections_translations.season, eng.season, default_trans.season) as season,
      COALESCE(sections_translations.flows_text, eng.flows_text, default_trans.flows_text) as flows_text,
      COALESCE(sections_translations.copyright, eng.copyright, default_trans.copyright) as copyright,
      sections.license,
      sections.season_numeric,
      sections.levels,
      sections.flows,
      sections.drop,
      sections.distance,
      sections.duration,
      sections.difficulty,
      sections.difficulty_xtra,
      sections.rating,
      sections.timezone,
      (ST_AsGeoJSON(sections.shape, 4) :: json) AS shape,
      (ST_AsGeoJSON(st_startpoint(sections.shape :: geometry) :: geography, 4) :: json) AS put_in,
      (ST_AsGeoJSON(st_endpoint(sections.shape :: geometry) :: geography, 4) :: json) AS take_out,
      sections.created_at,
      sections.updated_at,
      sections.created_by,
      sections.gauge_id,
      sections.river_id,
      rivers_view.name as river_name,
      sections.demo,
      sections.hidden,
      sections.help_needed,
      sections.verified,
      regions_view.id AS region_id,
      regions_view.name AS region_name,
      regions_view.premium AS premium,
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
           LEFT OUTER JOIN sections_translations default_trans
                      ON sections.id = default_trans.section_id
                        AND sections.default_lang = default_trans.language
           LEFT OUTER JOIN sections_translations eng
                      ON sections.id = eng.section_id
                        AND eng.language = 'en'
           INNER JOIN rivers_view
                      ON sections.river_id = rivers_view.id
                        AND rivers_view.language = langs.language
           INNER JOIN regions_view
                      ON rivers_view.region_id = regions_view.id
                        AND regions_view.language = langs.language
