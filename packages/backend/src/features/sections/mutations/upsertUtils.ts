import {
  NEW_ID,
  OTHERS_REGION_ID,
  RiverInput,
  SectionInput,
} from '@whitewater-guide/commons';
import { UserInputError } from 'apollo-server-koa';

import { UnknownError } from '~/apollo';
import db, { rawUpsert } from '~/db';
import { RiverRaw } from '~/features/rivers';

export const checkForNewRiver = (section: SectionInput) => {
  const shouldInsertRiver = section.river.id === NEW_ID;
  if (shouldInsertRiver && section.id) {
    throw new UserInputError('cannot create new river for existing section');
  }
  return shouldInsertRiver;
};

export const insertNewRiver = async (
  section: SectionInput,
  language: string,
) => {
  if (!section.river.name) {
    throw new UnknownError('new river must have name');
  }
  const riverInput: RiverInput = {
    id: null,
    altNames: null,
    name: section.river.name,
    region: section.region ?? { id: OTHERS_REGION_ID },
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
