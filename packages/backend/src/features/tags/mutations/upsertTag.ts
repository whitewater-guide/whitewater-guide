import { Context, isInputValidResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { TagInput, TagInputStruct } from '@ww-commons';
import { struct } from 'superstruct';

interface Vars {
  tag: TagInput;
}

const Struct = struct.object({
  tag: TagInputStruct,
});

const upsertTag = isInputValidResolver<Vars>(
  Struct,
  (_: any, { tag }: Vars, { language }: Context) =>
    rawUpsert(db(), 'SELECT upsert_tag(?, ?)', [tag, language]),
);

export default upsertTag;
