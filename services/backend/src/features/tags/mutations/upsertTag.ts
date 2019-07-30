import { Context, isInputValidResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { TagInput, TagInputSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';

interface Vars {
  tag: TagInput;
}

const Struct = yup.object({
  tag: TagInputSchema,
});

const upsertTag = isInputValidResolver<Vars>(
  Struct,
  (_: any, { tag }: Vars, { language }: Context) =>
    rawUpsert(db(), 'SELECT upsert_tag(?, ?)', [tag, language]),
);

export default upsertTag;
