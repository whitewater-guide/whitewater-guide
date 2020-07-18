CREATE OR REPLACE FUNCTION remove_section(section_id UUID)
  RETURNS JSON AS $$
DECLARE
  result sections%ROWTYPE;
BEGIN
  WITH deleted_section AS (
    DELETE FROM sections
    WHERE sections.id = section_id
    RETURNING *
  ) SELECT * INTO result FROM deleted_section;

  IF FOUND THEN
    DELETE FROM rivers
    WHERE
      rivers.id = result.river_id AND
      NOT EXISTS (SELECT * FROM sections WHERE sections.river_id = rivers.id);
  END IF;

  RETURN row_to_json(result);
END;
$$ LANGUAGE plpgsql;
