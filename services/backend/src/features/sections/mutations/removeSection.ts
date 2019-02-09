import { TopLevelResolver } from '@apollo';
import db from '@db';

interface Vars {
  id: string;
}

const removeSection: TopLevelResolver<Vars> = async (
  root,
  { id },
  { user, language, dataSources },
) => {
  await dataSources.sections.assertEditorPermissions(id);
  const deleted = await db()
    .select([
      'sections_view.id as section_id',
      'sections_view.name as section_name',
      'sections_view.river_id',
      'sections_view.river_name',
      'sections_view.region_id',
      'regions_view.name as region_name',
    ])
    .from('sections_view')
    .innerJoin('regions_view', 'sections_view.region_id', 'regions_view.id')
    .where('sections_view.language', language)
    .where('regions_view.language', language)
    .where('sections_view.id', id)
    .first();
  const result = await db()
    .table('sections')
    .del()
    .where({ id })
    .returning('id');
  if (result && result.length && deleted) {
    await db()
      .insert({
        ...deleted,
        action: 'delete',
        editor_id: user!.id,
      })
      .into('sections_edit_log');
  }
  return result && result.length ? result[0] : null;
};

export default removeSection;
