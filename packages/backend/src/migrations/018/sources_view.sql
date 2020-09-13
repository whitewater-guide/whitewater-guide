CREATE OR REPLACE VIEW sources_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
      SELECT * from sources_translations WHERE language = 'en'
  )
  SELECT
    sources.id,
    langs.language,
    sources.script,
    sources.cron,
    sources.harvest_mode,
    sources.url,
    sources.enabled,
    sources.request_params,
    sources.created_at,
    sources.updated_at,
    COALESCE(sources_translations.name, english.name, 'Not translated') as name,
    COALESCE(sources_translations.terms_of_use, english.terms_of_use) as terms_of_use
  FROM langs
    CROSS JOIN sources
    LEFT OUTER JOIN sources_translations
      ON sources.id = sources_translations.source_id AND sources_translations.language = langs.language
    LEFT OUTER JOIN english
      ON sources.id = english.source_id
