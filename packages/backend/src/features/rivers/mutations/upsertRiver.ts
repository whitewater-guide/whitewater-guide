import { isInputValidResolver, TopLevelResolver } from '@apollo';
import db, { rawUpsert } from '@db';
import { RiverInput, RiverInputSchema } from '@ww-commons';
import Joi from 'joi';
import checkEditorPermissions from '../checkEditorPermissions';

interface Vars {
  river: RiverInput;
}

const Schema = Joi.object().keys({
  river: RiverInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (root, vars, { user, language }) => {
  const river = { ...vars.river, createdBy: user ? user.id : null };
  await checkEditorPermissions(user, river.id, river.region.id);
  return rawUpsert(db(), 'SELECT upsert_river(?, ?)', [river, language]);
};

const upsertRiver = isInputValidResolver(Schema).createResolver(resolver);

export default upsertRiver;
