import { isInputValidResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { GroupInput, GroupInputStruct } from '@ww-commons';
import { struct } from 'superstruct';

interface Vars {
  group: GroupInput;
}

const Struct = struct.object({
  group: GroupInputStruct,
});

const upsertGroup = isInputValidResolver<Vars>(
  Struct,
  (_, { group }, { language }) =>
    rawUpsert(db(), 'SELECT upsert_group(?, ?)', [group, language]),
);

export default upsertGroup;
