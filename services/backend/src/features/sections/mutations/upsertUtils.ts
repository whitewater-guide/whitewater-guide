import { UnknownError } from '@apollo';
import db, { rawUpsert } from '@db';
import { RiverRaw } from '@features/rivers';
import { NEW_ID, RiverInput, SectionInput } from '@whitewater-guide/commons';
import { UserInputError } from 'apollo-server-errors';

export const checkForNewRiver = (section: SectionInput) => {
  const shouldInsertRiver = section.river.id === NEW_ID;
  if (shouldInsertRiver && section.id) {
    throw new UserInputError('cannot create new river for existing section');
  }
  if (shouldInsertRiver && !section.region) {
    throw new UserInputError(
      'cannot create new river when region is not provided',
    );
  }
  return shouldInsertRiver;
};

export const insertNewRiver = async (
  section: SectionInput,
  language: string,
) => {
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
  if (!river) {
    throw new UnknownError('failed to insert new river');
  }
  return river.id;
};
