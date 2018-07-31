import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { SectionInput, SectionInputStruct } from '@ww-commons';
import { struct } from 'superstruct';

interface Vars {
  section: SectionInput;
}

const Struct = struct.object({
  section: SectionInputStruct,
});

const resolver: TopLevelResolver<Vars> = async (root, vars, { user, language, dataSources }) => {
  const section = { ...vars.section, createdBy: user ? user.id : null };
  await dataSources.sections.assertEditorPermissions(section.id, section.river.id);
  return rawUpsert(db(), 'SELECT upsert_section(?, ?)', [section, language]);
};

const upsertSection = isInputValidResolver(Struct, resolver);

export default upsertSection;
