CREATE FUNCTION trigger_delete_orphan_regions_points()
  RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM points
  WHERE id = OLD.point_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_orphan_regions_points
  AFTER DELETE ON regions_points
  FOR EACH ROW EXECUTE PROCEDURE trigger_delete_orphan_regions_points();