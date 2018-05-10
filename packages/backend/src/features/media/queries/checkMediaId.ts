import db from '../../../db';

const RAW_QUERY = `
  WITH media_found AS (
      SELECT exists(SELECT 1
                    FROM media
                    WHERE media.id = :id) AS found
  )
  SELECT
    media_found.found,
    CASE WHEN media_found.found THEN
      :id
    ELSE
      uuid_generate_v1mc()
    END AS id
  FROM media_found
`;

export interface MediaCheckResult {
  // True if media exists in db
  found: boolean;
  // media id (new, just generated if found == false or existing if found == true)
  id: string;
}

/**
 * Checks if media with this id exists, return its id
 * If not exists, generates new id and returns it
 * @param {string | null} mediaId
 * @returns {Promise<{found: boolean; id: string}>}
 */
export const checkMediaId = async (mediaId?: string | null): Promise<MediaCheckResult> => {
  const result = await db().raw(RAW_QUERY, { id: (mediaId || null) as any });
  const [{ found, id }] = result.rows;
  return { found, id };
};
