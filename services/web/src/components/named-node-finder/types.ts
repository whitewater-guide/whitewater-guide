import { NamedNode } from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';

export interface FinderProps<QResult, QVars> {
  // Set to undefined if selection is required
  clearSelectionTitle?: string;
  hintText?: string;
  query: DocumentNode;
  getVariables: (input: string | null) => QVars;
  getNodes: (result?: QResult) => NamedNode[];
}
