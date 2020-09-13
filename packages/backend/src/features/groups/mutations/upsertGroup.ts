import { GroupInput, GroupInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';

import { isInputValidResolver } from '~/apollo';
import db, { rawUpsert } from '~/db';

interface Vars {
  group: GroupInput;
}

const Struct = yup.object({
  group: GroupInputSchema,
});

const upsertGroup = isInputValidResolver<Vars>(
  Struct,
  (_, { group }, { language }) =>
    rawUpsert(db(), 'SELECT upsert_group(?, ?)', [group, language]),
);

export default upsertGroup;
