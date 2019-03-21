import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { SectionRaw } from '@features/sections';
import { SectionInput, SectionInputStruct } from '@whitewater-guide/commons';
import { DiffPatcher } from 'jsondiffpatch';
import { struct } from 'superstruct';

const differ = new DiffPatcher({
  propertyFilter: (name: keyof SectionRaw) => {
    return (
      name !== 'created_at' &&
      name !== 'created_by' &&
      name !== 'updated_at' &&
      name !== 'language' &&
      name !== 'region_name'
    );
  },
});

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
  await dataSources.users.assertEditorPermissions({
    sectionId: section.id,
    riverId: section.river.id,
  });
  const oldSection = await dataSources.sections.getById(section.id);
  const result: SectionRaw = await rawUpsert(
    db(),
    'SELECT upsert_section(?, ?)',
    [section, language],
  );
  if (result) {
    await db()
      .insert({
        section_id: result.id,
        section_name: result.name,
        river_id: result.river_id,
        river_name: result.river_name,
        region_id: result.region_id,
        region_name: result.region_name,
        action: section.id ? 'update' : 'create',
        editor_id: user!.id,
        diff: oldSection && differ.diff(oldSection, result),
      })
      .into('sections_edit_log');
  }
  return result;
};

const upsertSection = isInputValidResolver(Struct, resolver);

export default upsertSection;
