CREATE OR REPLACE FUNCTION upsert_section_media(section_id VARCHAR, media JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_media_id UUID;
  result            JSON;
BEGIN
  -- Then insert core
  WITH upserted_media AS (
    INSERT INTO media (id, kind, url, resolution, weight, created_by)
    VALUES (
      COALESCE((media ->> 'id') :: UUID, uuid_generate_v1mc()),
      (media ->> 'kind') :: MEDIA_KIND,
      media ->> 'url',
      CASE
        WHEN (media ->> 'resolution') IS NULL
        THEN NULL
        ELSE array_json_to_int(media -> 'resolution')
      END,
      COALESCE((media ->> 'weight') :: INTEGER, 0),
      (media ->> 'createdBy') :: UUID
    )
    ON CONFLICT (id)
      DO UPDATE SET
        created_by = media.created_by,
        kind       = media.kind,
        url        = EXCLUDED.url,
        resolution = EXCLUDED.resolution,
        weight     = EXCLUDED.weight
    RETURNING id
  ),
      upserted_translations AS (
      INSERT INTO media_translations (media_id, language, description, copyright)
        SELECT
          upserted_media.id,
          lang,
          media ->> 'description',
          media ->> 'copyright'
        FROM upserted_media
      ON CONFLICT (media_id, language)
        DO UPDATE SET
          description = EXCLUDED.description,
          copyright   = EXCLUDED.copyright
      RETURNING media_id
    )
  INSERT INTO sections_media (media_id, section_id)
    SELECT
      upserted_translations.media_id,
      section_id :: UUID
    FROM upserted_translations
  ON CONFLICT ON CONSTRAINT sections_media_pkey
    DO UPDATE SET
      media_id   = sections_media.media_id,
      section_id = sections_media.section_id
  RETURNING media_id
    INTO upserted_media_id;

  -- return the result
  SELECT to_json(media_view)
  FROM media_view
  WHERE id = upserted_media_id AND language = lang
  INTO result;

  RETURN result;
END;
$$
LANGUAGE plpgsql;
