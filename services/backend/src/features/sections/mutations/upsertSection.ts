import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { SectionRaw } from '@features/sections';
import { SectionInput, SectionInputStruct } from '@whitewater-guide/commons';
import { struct } from 'superstruct';

interface Vars {
  section: SectionInput;
}

const Struct = struct.object({
  section: SectionInputStruct,
});

const resolver: TopLevelResolver<Vars> = async (
  root,
  vars,
  { user, language, dataSources },
) => {
  const section = { ...vars.section, createdBy: user ? user.id : null };
  await dataSources.sections.assertEditorPermissions(
    section.id,
    section.river.id,
  );
  let oldName = 'Not translated';
  if (section.id) {
    // get old name for edit log
    const oldNameRow = await db()
      .select('name')
      .from('sections_translations')
      .where('section_id', section.id)
      .where('language', language)
      .first();
    oldName = oldNameRow ? oldNameRow.name : oldName;
  }
  const result: SectionRaw = await rawUpsert(
    db(),
    'SELECT upsert_section(?, ?)',
    [section, language],
  );
  if (result) {
    await db()
      .insert({
        section_id: result.id,
        old_section_name: section.id ? oldName : result.name,
        new_section_name: result.name,
        river_id: result.river_id,
        river_name: result.river_name,
        region_id: result.region_id,
        region_name: result.region_name,
        action: section.id ? 'update' : 'create',
        editor_id: user!.id,
      })
      .into('sections_edit_log');
  }
  return result;
};

const upsertSection = isInputValidResolver(Struct, resolver);

export default upsertSection;
