import { Context, isInputValidResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { GroupInput, GroupInputSchema } from '@ww-commons';
import Joi from 'joi';

interface Vars {
  group: GroupInput;
}

const Schema = Joi.object().keys({
  group: GroupInputSchema,
});

const upsertGroup = isInputValidResolver(Schema).createResolver(
  (_: any, { group }: Vars, { language }: Context) =>
    rawUpsert(db(), 'SELECT upsert_group(?, ?)', [group, language]),
);

export default upsertGroup;
