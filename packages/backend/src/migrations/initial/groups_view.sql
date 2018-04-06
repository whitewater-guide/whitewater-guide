CREATE OR REPLACE VIEW groups_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
      SELECT * from groups_translations WHERE language = 'en'
  )
  SELECT
    groups.id,
    langs.language,
    COALESCE(groups_translations.name, english.name, 'Not translated') as name
  FROM langs
    CROSS JOIN groups
    LEFT OUTER JOIN groups_translations
      ON groups.id = groups_translations.group_id
         AND groups_translations.language = langs.language
    LEFT OUTER JOIN english
      ON groups.id = english.group_id
