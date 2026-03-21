CREATE OR REPLACE FUNCTION upsert_section(section JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_section_id UUID;
  result              JSON;
  pois                JSON;
  tags                JSON;
  mediaJson           JSON;
  point_ids           UUID[] := '{}'::UUID[];
  upserted_media_ids  UUID[] := '{}'::UUID[];
  deleted_media_ids   UUID[] := '{}'::UUID[];
  deleted_media_urls  TEXT[] := '{}'::TEXT[];
BEGIN
  pois  := section -> 'pois';
  tags  := section -> 'tags';
  mediaJson := section -> 'media';

  WITH upserted_section AS (
    INSERT INTO sections (
      id,
      river_id,
      gauge_id,
      season_numeric,
      levels,
      flows,
      shape,
      distance,
      "drop",
      duration,
      difficulty,
      difficulty_xtra,
      rating,
      created_by,
      hidden,
      help_needed,
      demo,
      import_id
    )
    VALUES (
      COALESCE((section ->> 'id') :: UUID, uuid_generate_v1mc()),
      ((section -> 'river') ->> 'id') :: UUID,
      (section -> 'gauge' ->> 'id') :: UUID,
      COALESCE(array_json_to_int(section -> 'seasonNumeric'), '{}' :: INTEGER []),
      section -> 'levels',
      section -> 'flows',
      linestring_from_json(section -> 'shape'),
      (section ->> 'distance') :: real,
      (section ->> 'drop') :: real,
      (section ->> 'duration') :: integer,
      (section ->> 'difficulty') :: real,
      section ->> 'difficultyXtra',
      (section ->> 'rating') :: real,
      (section ->> 'createdBy') :: UUID,
      (section ->> 'hidden') :: boolean,
      section ->> 'helpNeeded',
      ((section ->> 'suggestionId') IS NOT NULL),
      section ->> 'importId'
    )
    ON CONFLICT (id)
      DO UPDATE SET
        river_id        = EXCLUDED.river_id,
        gauge_id        = EXCLUDED.gauge_id,
        season_numeric  = EXCLUDED.season_numeric,
        levels          = EXCLUDED.levels,
        flows           = EXCLUDED.flows,
        shape           = EXCLUDED.shape,
        distance        = EXCLUDED.distance,
        "drop"          = EXCLUDED."drop",
        duration        = EXCLUDED.duration,
        difficulty      = EXCLUDED.difficulty,
        difficulty_xtra = EXCLUDED.difficulty_xtra,
        rating          = EXCLUDED.rating,
        created_by      = sections.created_by,
        hidden          = EXCLUDED.hidden,
        help_needed     = EXCLUDED.help_needed,
        demo            = EXCLUDED.demo,
        import_id       = EXCLUDED.import_id
    RETURNING id
  )
  INSERT INTO sections_translations (section_id, language, name, alt_names, description, season, flows_text)
    SELECT
      upserted_section.id,
      lang,
      section ->> 'name',
      CASE
        WHEN (section ->> 'altNames') IS NULL
          THEN '{}'::VARCHAR[]
          ELSE array_json_to_varchar(section -> 'altNames')
      END,
      section ->> 'description',
      section ->> 'season',
      section ->> 'flowsText'
    FROM upserted_section
  ON CONFLICT (section_id, language)
    DO UPDATE SET
      name        = EXCLUDED.name,
      alt_names   = EXCLUDED.alt_names,
      description = EXCLUDED.description,
      season      = EXCLUDED.season,
      flows_text   = EXCLUDED.flows_text
  RETURNING section_id
    INTO upserted_section_id;

  IF pois IS NOT NULL
  THEN
    -- now insert all points once again
    WITH new_pois AS (
        SELECT upsert_points(pois, lang) as id
    ), inserted_points AS (
      INSERT INTO sections_points (point_id, section_id)
        SELECT
          new_pois.id,
          upserted_section_id
        FROM new_pois
      ON CONFLICT (point_id, section_id) DO NOTHING
      RETURNING point_id
    ), all_points AS (
      SELECT point_id FROM inserted_points -- inserted
      UNION  ALL
      SELECT new_pois.id AS point_id -- not inserted
      FROM new_pois
        INNER JOIN points ON points.id = new_pois.id
    )
    SELECT array_agg(point_id)
    FROM all_points
    INTO point_ids;
  END IF;

  -- delete all existing points for this section
  -- sections_points will be deleted by ON DELETE CASCADE
  -- points_translations will be deleted by ON DELETE CASCADE
  DELETE FROM points
  WHERE EXISTS(SELECT *
               FROM sections_points
               WHERE sections_points.section_id = upserted_section_id AND
                     sections_points.point_id = points.id AND
                     NOT(sections_points.point_id = ANY(point_ids))
  );

  ---------------- MEDIA ----------------

  IF mediaJson IS NOT NULL
  THEN
      -- insert ALL medias (update old and insert old, this keeps deleted)
      WITH upserted_media AS (
          SELECT upsert_section_media(upserted_section_id :: varchar, mediaJson, lang) as id
      )
      SELECT array_agg(upserted_media.id)
      FROM upserted_media
      INTO upserted_media_ids;

      SELECT array_agg(media.id), array_agg(media.url)
      FROM sections_media
        INNER JOIN media on sections_media.media_id = media.id
      WHERE
          section_id = upserted_section_id AND
          NOT (media_id = ANY(upserted_media_ids))
      INTO deleted_media_ids, deleted_media_urls;

      -- delete all media for this section that was not inserted or updated above
      -- sections_points will be deleted by ON DELETE CASCADE
      -- points_translations will be deleted by ON DELETE CASCADE
      DELETE FROM media
      WHERE id = ANY(deleted_media_ids);
  END IF;
  ------------- END OF MEDIA ------------

  ---------------- TAGS ----------------
  -- Delete all old tags
  DELETE FROM sections_tags WHERE section_id = upserted_section_id;
  -- Insert new tags
  IF tags IS NOT NULL THEN
    INSERT INTO sections_tags(tag_id, section_id)
      SELECT id, upserted_section_id from json_to_recordset(tags) as x(id VARCHAR);
  END IF;
  ------------- END OF TAGS-------------

  -- return the result
  SELECT json_build_array(to_json(sections_view), upserted_media_ids, deleted_media_urls)
  FROM sections_view
  WHERE id = upserted_section_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
