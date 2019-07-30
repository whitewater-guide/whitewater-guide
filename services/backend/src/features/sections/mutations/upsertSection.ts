import { isInputValidResolver, TopLevelResolver, UnknownError } from '@apollo';
import db, { rawUpsert } from '@db';
import { RiverRaw } from '@features/rivers';
import { SectionRaw } from '@features/sections';
import {
  NEW_ID,
  RiverInput,
  SectionInput,
  SectionInputSchema,
} from '@whitewater-guide/commons';
import { UserInputError } from 'apollo-server-errors';
import { DiffPatcher } from 'jsondiffpatch';
import * as yup from 'yup';

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

const Struct = yup.object({
  section: SectionInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (
  root,
  vars,
  { user, language, dataSources },
) => {
  const section = { ...vars.section, createdBy: user ? user.id : null };
  const shouldInsertRiver = section.river.id === NEW_ID;
  if (shouldInsertRiver && section.id) {
    throw new UserInputError('cannot create new river for existing section');
  }
  if (shouldInsertRiver && !section.region) {
    throw new UserInputError(
      'cannot create new river when region is not provided',
    );
  }

  const query = shouldInsertRiver
    ? { regionId: section.region!.id }
    : {
        sectionId: section.id,
        riverId: section.river.id,
      };
  await dataSources.users.assertEditorPermissions(query);

  // Create new river simultaneously
  if (shouldInsertRiver) {
    const riverInput: RiverInput = {
      id: null,
      altNames: null,
      name: section.river.name!,
      region: section.region!,
    };
    const river: RiverRaw | undefined = await rawUpsert(
      db(),
      'SELECT upsert_river(?, ?)',
      [riverInput, language],
    );
    if (river) {
      section.river.id = river.id;
    } else {
      throw new UnknownError('failed to insert new river');
    }
  }

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
