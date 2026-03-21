CREATE OR REPLACE FUNCTION upsert_section_media(section_id VARCHAR, media JSON, lang LANGUAGE_CODE)
  RETURNS SETOF UUID AS $$
DECLARE
  mediaArr           JSON;
BEGIN
  -- cast to array
  IF json_typeof(media) = 'array'
  THEN
      mediaArr = media;
  ELSE
      mediaArr = json_build_array(media);
  END IF;

  RETURN QUERY WITH raws AS (
      select * from json_to_recordset(mediaArr) as (
          id UUID,
          kind MEDIA_KIND,
          url TEXT,
          resolution INTEGER[],
          size INTEGER,
          weight INTEGER,
          "createdBy" UUID,
          description TEXT,
          copyright TEXT
      )
  ),
  medias AS (
      SELECT
          COALESCE(raws.id, uuid_generate_v1mc()) as id,
          raws.kind,
          raws.url,
          raws.resolution,
          COALESCE(raws.size, 0) as size,
          COALESCE(raws.weight, 0) as weight,
          raws."createdBy",
          raws.description,
          raws.copyright
      FROM raws
  ),
  upserted_media AS (
    INSERT INTO media (id, kind, url, resolution, size, weight, created_by, default_lang)
    SELECT
      medias.id,
      medias.kind,
      medias.url,
      medias.resolution,
      medias.size,
      medias.weight,
      medias."createdBy",
      lang
    FROM medias
    ON CONFLICT (id)
      DO UPDATE SET
        url        = EXCLUDED.url,
        resolution = EXCLUDED.resolution,
        size       = EXCLUDED.size,
        weight     = EXCLUDED.weight
    RETURNING id
  ),
  upserted_translations AS (
    INSERT INTO media_translations (media_id, language, description, copyright)
      SELECT
        upserted_media.id,
        lang,
        medias.description,
        medias.copyright
      FROM upserted_media
        INNER join medias ON upserted_media.id = medias.id
    ON CONFLICT (media_id, language)
      DO UPDATE SET
        description = EXCLUDED.description,
        copyright   = EXCLUDED.copyright
    RETURNING media_id
  )
  INSERT INTO sections_media (media_id, section_id)
  SELECT upserted_translations.media_id,
         section_id :: UUID
  FROM upserted_translations
  ON CONFLICT ON CONSTRAINT sections_media_pkey DO UPDATE SET
      media_id   = EXCLUDED.media_id,
      section_id = EXCLUDED.section_id
  RETURNING media_id as id;
END;
$$
LANGUAGE plpgsql;
