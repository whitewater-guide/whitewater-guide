import { NamedNode } from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';
import { QueryResult } from 'react-apollo';

/**
 * strings or simple queries with selection aliased as 'node', e.g.
 * query bannerName($id: ID!) {
 *  node: banner(id: $id) {
 *    id
 *    name
 *  }
 * }
 */
export type BreadcrumbValue =
  | string
  | {
      query: DocumentNode;
      getName?: (result: QueryResult) => string | undefined;
    };

// Keys: full paths, e.g. '/regions/:regionId/settings'
export interface BreadcrumbsMap {
  [path: string]: BreadcrumbValue;
}

export interface BreadcrumbMatch {
  path: string; // '/regions/:regionId/sections/:sectionId'
  param: BQVars | null;
  value: BreadcrumbValue;
}

export interface BreadcrumbsProps {
  routes: BreadcrumbsMap;
}

export interface BQVars {
  id: string;
}

export interface BQResult {
  node: NamedNode;
}
