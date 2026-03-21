CREATE OR REPLACE VIEW tags_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
      SELECT * from tags_translations WHERE language = 'en'
  )
  SELECT
    tags.id,
    langs.language,
    tags.category,
    COALESCE(tags_translations.name, english.name, tags.id) as name
  FROM langs
    CROSS JOIN tags
    LEFT OUTER JOIN tags_translations
      ON tags.id = tags_translations.tag_id AND tags_translations.language = langs.language
    LEFT OUTER JOIN english
      ON tags.id = english.tag_id
