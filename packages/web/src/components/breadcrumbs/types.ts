import type { QueryResult } from '@apollo/client';
import type { DocumentNode } from 'graphql';

/**
 * simple queries with selection aliased as 'node', e.g.
 * query bannerName($id: ID!) {
 *  node: banner(id: $id) {
 *    id
 *    name
 *  }
 * }
 */
export interface QueryBreadcrumbValue {
  query: DocumentNode;
  getName?: (result: QueryResult) => string | undefined;
}

export type SimpleBreadcrumbValue = string;

export type BreadcrumbValue = SimpleBreadcrumbValue | QueryBreadcrumbValue;

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
