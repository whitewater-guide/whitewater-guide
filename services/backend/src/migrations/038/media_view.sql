CREATE OR REPLACE VIEW media_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  )
  SELECT
    media.id,
    langs.language,
    media.kind,
    media.url,
    media.weight,
    media.resolution,
    media.created_at,
    media.updated_at,
    media.created_by,
    media.size,
    COALESCE(media_translations.description, eng.description, default_trans.description) as description,
    COALESCE(media_translations.copyright, eng.copyright, default_trans.copyright) as copyright
  FROM langs
    CROSS JOIN media
    LEFT OUTER JOIN media_translations
      ON media.id = media_translations.media_id AND media_translations.language = langs.language
    LEFT OUTER JOIN media_translations default_trans
        ON media.id = default_trans.media_id
         AND media.default_lang = default_trans.language
    LEFT OUTER JOIN media_translations eng
        ON media.id = eng.media_id
         AND eng.language = 'en'
