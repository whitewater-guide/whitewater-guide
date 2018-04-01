CREATE OR REPLACE VIEW media_view AS
  WITH langs AS (
      SELECT unnest(enum_range(NULL::language_code)) AS language
  ), english AS (
    SELECT * from media_translations WHERE language = 'en'
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
    COALESCE(media_translations.description, english.description) as description,
    COALESCE(media_translations.copyright, english.copyright) as copyright
  FROM langs
    CROSS JOIN media
    LEFT OUTER JOIN media_translations
      ON media.id = media_translations.media_id AND media_translations.language = langs.language
    LEFT OUTER JOIN english
      ON media.id = english.media_id
