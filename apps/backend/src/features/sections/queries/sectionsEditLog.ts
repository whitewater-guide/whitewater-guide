import type { QueryResolvers } from '../../../apollo/index';
import type { Sql } from '../../../db/index';
import { db } from '../../../db/index';

interface RawLog extends Sql.SectionsEditLog {
  count: number;
  editor_name: string;
}

const sectionsEditLog: QueryResolvers['sectionsEditLog'] = async (
  _,
  { filter, page },
) => {
  const { limit = 20, offset = 0 } = page ?? {};
  const { editorId, regionId } = filter ?? {};
  let query = db()
    .table('sections_edit_log')
    .innerJoin('users', 'sections_edit_log.editor_id', 'users.id')
    .select(
      'sections_edit_log.*',
      'users.name as editor_name',
      db().raw('count(*) OVER()'),
    )
    .orderBy('created_at', 'desc')
    .limit(limit ?? 20)
    .offset(offset ?? 0);
  if (editorId) {
    query = query.where('editor_id', editorId);
  }
  if (regionId) {
    query = query.where('region_id', regionId);
  }
  const rawResult: RawLog[] = await query;
  const count = rawResult.length ? rawResult[0].count : 0;
  const nodes = rawResult.map((entry) => ({
    id: entry.id,
    section: {
      id: entry.section_id,
      name: entry.section_name,
      region_id: entry.region_id,
      region_name: entry.region_name,
      river_id: entry.river_id,
      river_name: entry.river_name,
    },
    editor: {
      id: entry.editor_id,
      name: entry.editor_name,
    },
    action: entry.action,
    diff: entry.diff,
    createdAt: entry.created_at,
  }));
  return { nodes, count };
};

export default sectionsEditLog;
