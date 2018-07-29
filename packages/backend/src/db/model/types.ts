import { Context } from '@apollo';
import { Omit } from 'type-zoo';
import { createModels } from './createModels';

export type ContextWithoutModels = Omit<Context, 'models'>;

export type Models = ReturnType<typeof createModels>;

export type FieldsMap<TGraphql, TSql> = {
  [P in keyof TGraphql]?: keyof TSql | Array<keyof TSql> | null;
};
