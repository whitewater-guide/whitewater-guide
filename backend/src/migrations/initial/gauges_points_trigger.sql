CREATE FUNCTION trigger_delete_orphan_gauges_points()
  RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM points
  WHERE id = OLD.location_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_orphan_gauges_points
  AFTER DELETE ON gauges
  FOR EACH ROW EXECUTE PROCEDURE trigger_delete_orphan_gauges_points();