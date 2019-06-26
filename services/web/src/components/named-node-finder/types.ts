import { NamedNode } from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';
import { QueryResult } from 'react-apollo';

export interface FinderProps<QResult, QVars> {
  fullWidth?: boolean;

  showListWhenInputIsEmpty?: boolean;
  // Set to undefined if selection is required
  clearSelectionTitle?: string;
  hintText?: string;

  // Either (query, getVariables, getNodes) or fixed dataSource must be provided
  query?: DocumentNode;

  dataSource?: NamedNode[];
  getVariables?: (input: string | null) => QVars;
  getNodes?: (result?: QResult) => NamedNode[];
}
