import Joi from 'joi';
import { Context, isInputValidResolver } from '../../../apollo';
import db, { rawUpsert, stringifyJSON } from '../../../db';
import { TagInput, TagInputSchema } from '../../../ww-commons';

interface Vars {
  tag: TagInput;
}

const Schema = Joi.object().keys({
  tag: TagInputSchema,
});

const upsertTag = isInputValidResolver(Schema).createResolver(
  (_: any, { tag }: Vars, { language }: Context) =>
    rawUpsert(db(), `SELECT upsert_tag('${stringifyJSON(tag)}', '${language}')`),
);

export default upsertTag;
