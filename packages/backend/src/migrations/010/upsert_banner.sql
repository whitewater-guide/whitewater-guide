CREATE OR REPLACE FUNCTION upsert_banner(banner JSON)
  RETURNS JSON AS $$
DECLARE
  upserted_banner_id UUID;
  result             JSON;
BEGIN
  INSERT INTO banners (id, name, slug, priority, enabled, placement, source, link, extras)
  VALUES (
    COALESCE((banner ->> 'id') :: UUID, uuid_generate_v1mc()),
    banner ->> 'name',
    banner ->> 'slug',
    (banner ->> 'priority') :: integer,
    (banner ->> 'enabled') :: boolean,
    banner ->> 'placement',
    banner -> 'source',
    banner ->> 'link',
    (banner -> 'extras') :: json
  )
  ON CONFLICT (id)
    DO UPDATE SET
      name      = EXCLUDED.name,
      priority  = EXCLUDED.priority,
      enabled   = EXCLUDED.enabled,
      placement = EXCLUDED.placement,
      source    = EXCLUDED.source,
      link      = EXCLUDED.link,
      extras    = EXCLUDED.extras
  RETURNING id
    INTO upserted_banner_id;

  -- delete all existing banners -> regions/groups connection for this source
  DELETE FROM banners_regions WHERE banner_id = upserted_banner_id;
  DELETE FROM banners_groups WHERE banner_id = upserted_banner_id;
  -- insert regions connections
  INSERT INTO banners_regions (banner_id, region_id)
  SELECT upserted_banner_id, regions_json.id :: UUID
  FROM json_to_recordset(banner -> 'regions') as regions_json (id text);
  -- insert group connections
  INSERT INTO banners_groups (banner_id, group_id)
  SELECT upserted_banner_id, groups_json.id :: UUID
  FROM json_to_recordset(banner -> 'groups') as groups_json (id text);

  -- return the result
  SELECT to_json(banners)
  FROM banners
  WHERE id = upserted_banner_id
  INTO result;

  RETURN result;
END;
$$
LANGUAGE plpgsql;
