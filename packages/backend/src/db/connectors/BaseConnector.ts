import { DataSource, DataSourceConfig } from 'apollo-datasource';
import DataLoader from 'dataloader';
import { QueryBuilder } from 'knex';
import snakeCase from 'lodash/snakeCase';

import { Context, ContextUser } from '~/apollo';
import db from '~/db';

import { FieldsMap, OrderBy } from './types';

export abstract class BaseConnector<TGraphql, TSql extends { id: string }>
  implements DataSource<Context> {
  protected readonly _loader: DataLoader<string, TSql | null>;
  protected _context!: Context;
  protected _user: ContextUser | undefined;
  protected _language?: string;
  protected _fieldsByType!: Map<string, Set<string>>;

  // fields that should be set in subclass
  protected _tableName!: string;
  protected _graphqlTypeName!: string;
  protected _fieldsMap: FieldsMap<TGraphql, TSql> = {};
  // Extra sql fields to be always included in query
  protected _sqlFields: Array<keyof TSql> = ['id'];
  protected _orderBy: OrderBy[] = [
    { column: 'name', direction: 'asc' },
    { column: 'created_at', direction: 'desc' },
    { column: 'id', direction: 'asc' },
  ];

  constructor() {
    this._loader = new DataLoader<string, TSql | null>(
      this.getBatch.bind(this),
    );
  }

  initialize({ context }: DataSourceConfig<Context>) {
    this._context = context;
    this._user = context.user;
    this._language = context.language;
    this._fieldsByType = context.fieldsByType;
  }

  private async getBatch(keys: string[]): Promise<Array<TSql | null>> {
    const query = this.getBatchQuery(keys);
    const values: TSql[] = (await query) || [];
    return keys.map((key) => values.find(({ id }) => id === key) || null);
  }

  // Builds select query without WHERE cleauses
  public buildGenericQuery(): QueryBuilder {
    const fields: Set<keyof TGraphql> = this._fieldsByType.get(
      this._graphqlTypeName,
    )! as any;

    const sqlFieldsSet: Set<keyof TSql> = new Set<keyof TSql>(this._sqlFields);
    for (const graphqlField of fields.values()) {
      if (typeof graphqlField !== 'string') {
        continue;
      }
      if (graphqlField === '__typename') {
        continue;
      }
      const mapped = this._fieldsMap[graphqlField];
      if (mapped === null) {
        continue;
      } else if (!mapped) {
        sqlFieldsSet.add(snakeCase(graphqlField) as any);
      } else if (Array.isArray(mapped)) {
        mapped.forEach((f) => sqlFieldsSet.add(f));
      } else {
        sqlFieldsSet.add(mapped as any);
      }
    }

    const query = db().table(this._tableName).select(Array.from(sqlFieldsSet));

    if (this._language) {
      query.where({ language: this._language });
    }

    return query as any;
  }

  protected getBatchQuery(ids: string[]): QueryBuilder {
    const query = this.buildGenericQuery();
    return query.whereIn('id', ids);
  }

  getById(id?: string | null) {
    return id ? this._loader.load(id) : null;
  }
}
