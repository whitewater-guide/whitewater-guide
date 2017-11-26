CREATE OR REPLACE FUNCTION upsert_tag(tag JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_tag_id  VARCHAR;
  result           JSON;
BEGIN
  -- Then insert core
  WITH upserted_tag AS (
    INSERT INTO tags(id, category)
    VALUES (
      tag ->> 'id',
      (tag ->> 'category') :: tag_category
    )
    ON CONFLICT (id)
      DO UPDATE SET
        category         = EXCLUDED.category
    RETURNING id
  )
  INSERT INTO tags_translations(tag_id, language, name)
    SELECT
      upserted_tag.id,
      lang,
      tag ->> 'name'
    FROM upserted_tag
  ON CONFLICT (tag_id, language)
    DO UPDATE SET
      name        = EXCLUDED.name
  RETURNING tag_id
    INTO upserted_tag_id;

  -- return the result
  SELECT json_agg(tags_view)
  FROM tags_view
  WHERE id = upserted_tag_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
