import type { MutationResolvers } from '../../../apollo/index';
import { db, rawUpsert } from '../../../db/index';

const removeSection: MutationResolvers['removeSection'] = async (
  _,
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
      'gauges.source_id',
    ])
    .from('sections_view')
    .innerJoin('regions_view', 'sections_view.region_id', 'regions_view.id')
    .leftOuterJoin('gauges', 'sections_view.gauge_id', 'gauges.id')
    .where('sections_view.language', language)
    .where('regions_view.language', language)
    .where('sections_view.id', id)
    .first();

  const result: any = await rawUpsert(db(), 'SELECT remove_section(?)', [id]);

  if (result && deleted) {
    const { source_id: _skip, ...rest } = deleted;
    await db()
      .insert({
        ...rest,
        action: 'delete',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
        editor_id: user!.id,
      })
      .into('sections_edit_log');
  }
  if (deleted?.source_id) {
    await dataSources.gorge.updateJobForSource(deleted?.source_id);
  }
  return result ? result.id : null;
};

export default removeSection;
