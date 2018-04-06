CREATE OR REPLACE FUNCTION upsert_group(grp JSON, lang LANGUAGE_CODE)
  RETURNS JSON AS $$
DECLARE
  upserted_group_id  UUID;
  result             JSON;
BEGIN
  INSERT INTO groups(id)
  VALUES (
    COALESCE((grp ->> 'id') :: UUID, uuid_generate_v1mc())
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING id
    INTO upserted_group_id;


  INSERT INTO groups_translations(group_id, language, name) VALUES (
    COALESCE(upserted_group_id, (grp ->> 'id') :: UUID),
    lang,
    grp ->> 'name'
  )
  ON CONFLICT (group_id, language)
    DO UPDATE SET
      name        = EXCLUDED.name
  RETURNING group_id INTO upserted_group_id;

  -- return the result
  SELECT to_json(groups_view)
  FROM groups_view
  WHERE id = upserted_group_id AND language = lang
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
