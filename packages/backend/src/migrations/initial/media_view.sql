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
    COALESCE(media_translations.description, 'Not translated') as description,
    COALESCE(media_translations.copyright, 'Not translated') as copyright
  FROM langs
    CROSS JOIN media
    LEFT OUTER JOIN media_translations
      ON media.id = media_translations.media_id AND media_translations.language = langs.language
