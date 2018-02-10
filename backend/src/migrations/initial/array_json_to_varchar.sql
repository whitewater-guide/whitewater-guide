CREATE OR REPLACE FUNCTION array_json_to_varchar(p_input json)
  RETURNS varchar[] AS $$
DECLARE
  v_output varchar[];
BEGIN

  SELECT ARRAY_AGG(ary.value::varchar)
  INTO v_output
  FROM json_array_elements_text(p_input) AS ary;

  RETURN COALESCE(v_output, '{}'::VARCHAR[]);

END;
$$ LANGUAGE plpgsql;
