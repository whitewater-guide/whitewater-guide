import type { Page } from '@whitewater-guide/schema';
import type { Knex } from 'knex';

import type { createConnectors } from './createConnectors';

export type Connectors = ReturnType<typeof createConnectors>;

export type FieldsMap<TGraphql, TSql> = {
  [P in keyof TGraphql]?: keyof TSql | Array<keyof TSql> | null | Knex.Raw;
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

export type Where<TSql> =
  | { [P in keyof TSql]?: string | number | null }
  | Knex.QueryCallback
  | Knex.Raw;

export interface ManyBuilderOptions<TSql> {
  page?: Page | null;
  orderBy?: OrderBy[];
  where?: Where<TSql>;
}
