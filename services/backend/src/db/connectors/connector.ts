import { Context, ContextUser } from '~/apollo';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import DataLoader from 'dataloader';
import { GraphQLResolveInfo } from 'graphql';
import { QueryBuilder } from 'knex';
import { buildBatchQuery, buildConnectionQuery } from './queryBuilder';
import { FieldsMap, ManyBuilderOptions, OrderBy } from './types';

export class BaseConnector<TGraphql, TSql extends { id: string }>
  implements DataSource<Context> {
  protected readonly _loader: DataLoader<string, TSql | null>;
  protected _user: ContextUser | undefined;
  protected _language?: string;
  protected _fieldsByType!: Map<string, Set<string>>;

  // fields that should be set in subclass
  protected _tableName!: string;
  protected _graphqlTypeName!: string;
  protected _fieldsMap!: FieldsMap<TGraphql, TSql>;
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
    this._user = context.user;
    this._language = context.language;
    this._fieldsByType = context.fieldsByType;
  }

  private async getBatch(keys: string[]): Promise<Array<TSql | null>> {
    const query = this.getBatchQuery(keys);
    const values: TSql[] = (await query) || [];
    return keys.map((key) => values.find(({ id }) => id === key) || null);
  }

  protected getBatchQuery(keys: string[]): QueryBuilder {
    const graphqlFields: Set<keyof TGraphql> = this._fieldsByType.get(
      this._graphqlTypeName,
    )! as any;
    return buildBatchQuery<TGraphql, TSql>(
      this._tableName,
      {
        fields: graphqlFields,
        fieldsMap: this._fieldsMap,
        language: this._language,
        sqlFields: this._sqlFields,
      },
      keys,
    );
  }

  getById(id?: string | null) {
    return id ? this._loader.load(id) : null;
  }

  getMany(info: GraphQLResolveInfo, options: ManyBuilderOptions<TSql> = {}) {
    const query = buildConnectionQuery<TGraphql, TSql>(
      this._tableName,
      {
        fieldsMap: this._fieldsMap,
        language: this._language,
      },
      {
        ...options,
        orderBy: options.orderBy || this._orderBy,
      },
      info,
    );

    // const graphqlFields: Set<keyof Gauge> = this._fieldsByType.get('Gauge')! as any;
    // maybePrimeCache(graphqlFields, fields, query, this._loader);

    return query;
  }
}
