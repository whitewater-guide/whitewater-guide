CREATE OR REPLACE FUNCTION array_json_to_int(p_input json)
  RETURNS INTEGER[] AS $$
DECLARE
  v_output INTEGER[];
BEGIN

  SELECT ARRAY_AGG(ary.value::INTEGER)
  INTO v_output
  FROM json_array_elements_text(p_input) AS ary;

  RETURN COALESCE(v_output, '{}'::INTEGER[]);

END;
$$ LANGUAGE plpgsql;
