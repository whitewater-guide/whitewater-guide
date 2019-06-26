import { NamedNode } from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';
import { QueryResult } from 'react-apollo';

export interface FinderProps<QResult, QVars> {
  // Set to undefined if selection is required
  clearSelectionTitle?: string;
  hintText?: string;

  // Either query and getVariables or fixed dataSource must be provided
  query?: DocumentNode;
  dataSource?: QueryResult<QResult, QVars>;

  getVariables?: (input: string | null) => QVars;
  getNodes: (result?: QResult) => NamedNode[];
}
