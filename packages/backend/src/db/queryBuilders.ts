import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';
import Knex from 'knex';
import { castArray, snakeCase } from 'lodash';
import { Context, Page } from '../apollo';
import db from './db';

type ColumnMap<T> = {
  [field in keyof T]?: (context?: Context) => any;
};

interface ConnectionDescriptor {
  getBuilder: () => Builder; // Use getter to avoid circular dependencies
  join: Joiner;
  foreignKey?: string;
}

type ConnectionsMap<T> = {
  [field in keyof T]?: ConnectionDescriptor | null;
};

type OneToOnesMap<T> = ConnectionsMap<T>;

type Builder = (options: Partial<QueryBuilderOptions<any>>) => Knex.QueryBuilder;
type Joiner = (table: string, query: Knex.QueryBuilder) => Knex.QueryBuilder;

export const getPrimitives = <T>(
  topLevelFields: Array<keyof T>,
  prefix: string,
  context?: Context,
  connections?: Array<keyof T>,
  oneToOnes?: Array<keyof T>,
  customMap?: ColumnMap<T>,
): string[] => {
  return topLevelFields.reduce((result, field) => {
    // connection types, one-to-one relation types and __typename are ignored
    if (
      field === '__typename' ||
      connections && connections.includes(field) ||
      oneToOnes && oneToOnes.includes(field)
    ) {
      return result;
    }
    // Custom map allows to conditionally drop some statements based on context
    if (customMap && field in customMap) {
      const mapFunc: (context?: Context) => any = customMap[field]! as any;
      const mapped = mapFunc(context);
      return mapped ?  [...result, `${prefix}.${mapped}`] : result;
    }
    return [...result, `${prefix}.${snakeCase(field)}`];
  }, []);
};

export interface QueryBuilderOptions<T> {
  info?: GraphQLResolveInfo;
  fieldsTree?: {[key: string]: any};
  context: Context;
  table: string;
  tableAlias?: string;
  customFieldMap?: ColumnMap<T>;
  connections?: ConnectionsMap<T>;
  oneToOnes?: OneToOnesMap<T>;
  knex?: Knex;
  language?: string;
  orderBy?: string | string[];
  id?: string;
}

export const buildRootQuery = <T>(options: QueryBuilderOptions<T>): Knex.QueryBuilder => {
  const {
    info,
    fieldsTree,
    context,
    table,
    tableAlias,
    customFieldMap = {},
    connections = {},
    oneToOnes = {},
    knex = db(),
    language: lang,
    orderBy: ordBy,
    id,
  } = options;
  const alias = tableAlias || table;
  const language = lang || 'en';
  const orderBy: string[] = ordBy ? castArray(ordBy) : ['name', 'created_at', 'id'];
  let result = knex.from(tableAlias ? `${table} AS ${tableAlias}` : table);
  if (!fieldsTree && !info) {
    throw new Error('Provide either resolver info or parsed fields tree from resolver info');
  }
  const rootFieldsTree = fieldsTree || graphqlFields(info!);
  const topLevelFields: Array<keyof T> = Object.keys(rootFieldsTree) as any;
  const primitiveColumns = getPrimitives<T>(
    topLevelFields,
    alias,
    context,
    Object.keys(connections) as any,
    Object.keys(oneToOnes) as any,
    customFieldMap,
  );
  result = result.select(primitiveColumns);
  Object.entries(connections).forEach(([connectionName, value]) => {
    if (value && rootFieldsTree[connectionName]) {
      const { getBuilder, join, foreignKey } = value;
      attachConnection({
        knex,
        query: result,
        build: getBuilder(),
        join,
        context,
        language,
        name: connectionName,
        fieldsTree: rootFieldsTree[connectionName],
        foreignKey,
      });
    }
  });
  Object.entries(oneToOnes).forEach(([refName, value]) => {
    if (value && rootFieldsTree[refName]) {
      const { getBuilder, join, foreignKey } = value;
      attachOneToOne({
        knex,
        query: result,
        build: getBuilder(),
        join,
        context,
        language,
        name: refName,
        fieldsTree: rootFieldsTree[refName],
        foreignKey,
      });
    }
  });
  if (id) {
    result = result.where(`${alias}.id`, id);
  }
  if (language) {
    result = result.where(`${alias}.language`, language);
  }
  orderBy.forEach(fieldName => {
    result = result.orderBy(`${alias}.${fieldName}`);
  });
  return result;
};

export interface ListQueryBuilderOptions<T> extends QueryBuilderOptions<T> {
  page?: Page;
}

export const buildListQuery = <T>(options: ListQueryBuilderOptions<T>) => {
  const {
    info,
    fieldsTree, // ignored
    page,
    knex = db(),
    language: lang,
    id, // ignored
    ...rest,
  } = options;
  const { limit, offset } = page || { limit: null, offset: null };
  const language = lang || 'en';
  if (!info) {
    throw new Error('List query must be provided with resolvers info, because it is a root query');
  }
  const alias = options.tableAlias || options.table;
  const rootFieldsTree = graphqlFields(info);
  if (rootFieldsTree.nodes) {
    const query = buildRootQuery({ ...rest, knex, language, fieldsTree: rootFieldsTree.nodes });
    if (limit) {
      query.limit(limit);
      if (offset) {
        query.offset(offset);
      }
    }
    query.select(knex.raw(`count(${alias}.*) OVER()`));
    return query;
  }
  return knex.count().from(alias).where(`${alias}.language`, language);
};

/**
 * This will build a knex query which selects json object with fields 'nodes' (optional) and 'count' required
 * 'nodes' will contain json array of all rows (this will also include redundant count in each item)
 * @param {string} table - CTE which has 'count' column made with window function
 * @param {boolean} includeNodes - include nodes or just count them?
 * @param {Knex.Transaction | Knex} knex
 * @returns {Knex.QueryBuilder}
 */
export const buildConnectionJSONQuery = (table: string, includeNodes = true, knex = db()) => {
  // Assumption: we can request count without nodes, but if we request nodes we also must request count
  const nodes = includeNodes ? knex.select(knex.raw(`COALESCE(json_agg(${table}.*), '[]'::json)`)).from(table) : null;
  const count = knex.select(`${table}.count`).from(table).limit(1); // count comes from window function column
  const parts = [`'count'`, `(${count.toQuery()})`];
  if (nodes) {
    parts.push(`'nodes'`, `(${nodes.toQuery()})`);
  }
  return knex.select(knex.raw(`json_build_object(${parts.join(', ')})`));
};

export interface ConnectionBuilderOptions {
  /**
   * Table from where connected nodes come, this is cte in the root query
   */
  table: string;
  /**
   * Query modifier, that attaches join and where clauses to connected table to connect it to main table
   */
  join: Joiner;
  /**
   * Include connected nodes list or just count
   */
  includeNodes?: boolean;
  knex?: Knex;
  limit?: number;
  offset?: number;
}

/**
 * This will build query, which can later be used as a select subquery for this connection in a main query
 * For example, if you are querying source and need source name and regions connection
 * In this case, the select clause will contain one column - source name, and another column - this subquery for regions
 * @param {ConnectionBuilderOptions} options
 * @returns {Knex.QueryBuilder}
 */
export const buildConnectionColumn = (options: ConnectionBuilderOptions) => {
  const {
    table,
    join,
    includeNodes = true,
    knex = db(),
    limit,
    offset,
  } = options;
  const result = buildConnectionJSONQuery(`${table}_internal`, includeNodes, knex);
  return result.with(`${table}_internal`, (db2) => {
    // Use COALESCE to prevent { count: null } response and return { count: 0 } instead
    let cte = db2.select(`${table}.*`, knex.raw(`COALESCE(count(${table}.*) OVER(), 0)`)).from(table);
    cte = join(table, cte);
    if (limit) {
      cte = cte.limit(limit);
      if (offset) {
        cte = cte.offset(offset);
      }
    }
    return cte;
  });
};

interface AttachConnectionOptions {
  /**
   * Root query
   */
  query: Knex.QueryBuilder;
  context: Context;
  name: string;
  /**
   * Builder to build connected nodes query
   */
  build: Builder;
  /**
   * In case of many-to-many connection this is not required, as join will happen through ids and junction table
   * In case of one-to-many connection this is foreign key that references root query table from connected nodes table
   */
  foreignKey?: string;
  /**
   * Joiner to join connection query with root query
   */
  join: Joiner;
  language: string;
  /**
   * This is fragment of root query graphql fields tree related to connection (nodes and count)
   */
  fieldsTree: {[key: string]: any};
  knex?: Knex;
}

/**
 * This function takes root query and connection.
 * Connection is described with name, fieldsTree (originating from graphq-fields),
 * build - function to build query for connected nodes (usually wrapper around buildQuery for other table)
 * and join - function to join main query with connection subquery (as one-to-many or many-to-many relation)
 * It returns modified orifinal one
 * @param {AttachConnectionOptions} options
 * @returns {Knex.QueryBuilder}
 */
export const attachConnection = (options: AttachConnectionOptions) => {
  const {
    query,
    language,
    context,
    name,
    build,
    join,
    fieldsTree,
    foreignKey,
    knex,
  } = options;
  const connection = buildConnectionColumn({
    knex,
    table: `${name}_connection`,
    join,
    includeNodes: !!fieldsTree.nodes,
  });
  const fk = foreignKey ? { [foreignKey]: {} } : undefined;
  // If we need only count (nodes === undefined) then we don't need this CTE all together,
  // but this requires extra code and logic, so we always ask at least for id
  const tree = { id: {}, ...fieldsTree.nodes, ...fk };
  return query.with(`${name}_connection`, knex!.raw(build({
      fieldsTree: tree,
      context,
      language,
      knex,
    }).toQuery()),
  ).select(knex!.raw(`(${connection.toQuery()}) as ${name}`));
};

export const attachOneToOne = (options: AttachConnectionOptions) => {
  const {
    query,
    language,
    context,
    name,
    build,
    join,
    fieldsTree,
    foreignKey,
    knex,
  } = options;
  const cteName = `${name}_ref`;
  const fk = foreignKey ? { [foreignKey]: {} } : undefined;
  // If we need only count (nodes === undefined) then we don't need this CTE all together,
  // but this requires extra code and logic, so we always ask at least for id
  const tree = { id: {}, ...fieldsTree, ...fk };
  let selectJson = knex!
    .select(knex!.raw(`to_json(${cteName}.*)`))
    .from(cteName);
  selectJson = join(cteName, selectJson);
  return query.with(cteName, knex!.raw(build({
      fieldsTree: tree,
      context,
      language,
      knex,
    }).toQuery()),
  ).select(knex!.raw(`(${selectJson.toQuery()}) as ${name}`));
};
