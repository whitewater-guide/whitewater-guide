CREATE OR REPLACE VIEW groups_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
      SELECT * from groups_translations WHERE language = 'en'
  )
  SELECT
    groups.id,
    langs.language,
    COALESCE(groups_translations.name, english.name, 'Not translated') as name,
    (
      SELECT json_agg((regions_view.id, regions_view.name))
      FROM regions_view
        INNER JOIN regions_groups ON regions_view.id = regions_groups.region_id
      WHERE regions_groups.group_id = groups.id AND regions_view.language = langs.language
    ) AS pois
  FROM langs
    CROSS JOIN groups
    LEFT OUTER JOIN groups_translations
      ON groups.id = groups_translations.group_id
         AND groups_translations.language = langs.language
    LEFT OUTER JOIN english
      ON groups.id = english.group_id
