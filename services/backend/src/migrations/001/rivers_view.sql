CREATE OR REPLACE VIEW rivers_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
      SELECT * from rivers_translations WHERE language = 'en'
  )
  SELECT
    rivers.id,
    langs.language,
    rivers.region_id,
    rivers.created_at,
    rivers.updated_at,
    rivers.created_by,
    COALESCE(rivers_translations.name, english.name, 'Not translated') as name,
    COALESCE(rivers_translations.alt_names, english.alt_names, '{}'::VARCHAR[]) as alt_names,
    (
      SELECT row_to_json(regions_view) FROM regions_view
      WHERE regions_view.id = rivers.region_id AND regions_view.language = langs.language
      LIMIT 1
    ) as region
  FROM langs
    CROSS JOIN rivers
    LEFT OUTER JOIN rivers_translations
      ON rivers.id = rivers_translations.river_id AND rivers_translations.language = langs.language
    LEFT OUTER JOIN english
      ON rivers.id = english.river_id