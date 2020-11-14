CREATE
OR REPLACE VIEW sources_view AS WITH langs AS (
  SELECT
    unnest(enum_range(NULL :: language_code)) AS language
)
SELECT
  sources.id,
  langs.language,
  sources.script,
  sources.cron,
  sources.url,
  sources.request_params,
  sources.created_at,
  sources.updated_at,
  COALESCE(
    sources_translations.name,
    default_trans.name,
    'Not translated'
  ) as name,
  COALESCE(
    sources_translations.terms_of_use,
    default_trans.terms_of_use
  ) as terms_of_use
FROM langs
CROSS JOIN sources
LEFT OUTER JOIN sources_translations ON sources.id = sources_translations.source_id
  AND sources_translations.language = langs.language
LEFT OUTER JOIN sources_translations default_trans
        ON sources.id = default_trans.source_id
         AND sources.default_lang = default_trans.language
