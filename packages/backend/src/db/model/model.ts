import { ContextUser } from '@apollo';
import DataLoader from 'dataloader';
import { GraphQLResolveInfo } from 'graphql';
import { buildBatchQuery, buildConnectionQuery } from './queryBuilder';
import { FieldsMap, ManyBuilderOptions } from './types';

export class BaseModel<TGraphql, TSql extends { id: string }> {
  protected readonly _loader: DataLoader<string, TSql | null>;
  protected readonly _user: ContextUser | undefined;
  protected readonly _language: string;
  protected readonly _fieldsByType: Map<string, Set<string>>;

  // fields that should be set in subclass
  protected _tableName!: string;
  protected _graphqlTypeName!: string;
  protected _fieldsMap!: FieldsMap<TGraphql, TSql>;

  constructor(user: ContextUser | undefined, language: string, fieldsByType: Map<string, Set<string>>) {
    this._user = user;
    this._language = language;
    this._fieldsByType = fieldsByType;
    this._loader = new DataLoader<string, TSql | null>(this.getBatch.bind(this));
  }

  protected async getBatch(keys: string[]): Promise<Array<TSql | null>> {
    const graphqlFields: Set<keyof TGraphql> = this._fieldsByType.get(this._graphqlTypeName)! as any;
    const query = buildBatchQuery<TGraphql, TSql>(
      this._tableName,
      {
        fields: graphqlFields,
        fieldsMap: this._fieldsMap,
        language: this._language,
      },
      keys,
    );
    const values: TSql[] = (await query) || [];
    return keys.map((key) => values.find(({ id }) => id === key) || null);
  };

  getById(id?: string | null) {
    return id ? this._loader.load(id) : null;
  }

  getMany(info: GraphQLResolveInfo, options: ManyBuilderOptions<TSql>) {
    const query = buildConnectionQuery<TGraphql, TSql>(
      this._tableName,
      {
        fieldsMap: this._fieldsMap,
        language: this._language,
      },
      options,
      info,
    );

    // const graphqlFields: Set<keyof Gauge> = this._fieldsByType.get('Gauge')! as any;
    // maybePrimeCache(graphqlFields, fields, query, this._loader);

    return query;
  };
}
