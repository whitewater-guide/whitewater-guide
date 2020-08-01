import { Page } from '@whitewater-guide/commons';
import Knex, { Raw } from 'knex';
import { createConnectors } from './createConnectors';
import { Cursor } from '~/apollo/cursor';

export type Connectors = ReturnType<typeof createConnectors>;

export type FieldsMap<TGraphql, TSql> = {
  [P in keyof TGraphql]?: keyof TSql | Array<keyof TSql> | null | Raw;
};

export interface BuilderOptions<TGraphql, TSql> {
  fields: Set<keyof TGraphql>;
  fieldsMap?: FieldsMap<TGraphql, TSql>;
  sqlFields?: Array<keyof TSql>;
  language?: string;
}

export interface OrderBy {
  column: string;
  direction?: 'asc' | 'desc';
}

// tslint:disable-next-line:ban-types
export type Where<TSql> =
  | { [P in keyof TSql]?: string | number | null }
  | Knex.QueryCallback
  | Knex.Raw;

export interface ManyBuilderOptions<TSql> {
  page?: Page<Cursor>;
  orderBy?: OrderBy[];
  where?: Where<TSql>;
}
