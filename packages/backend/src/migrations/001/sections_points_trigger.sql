CREATE FUNCTION trigger_delete_orphan_sections_points()
  RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM points
  WHERE id = OLD.point_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_orphan_sections_points
  AFTER DELETE ON sections_points
  FOR EACH ROW EXECUTE PROCEDURE trigger_delete_orphan_sections_points();