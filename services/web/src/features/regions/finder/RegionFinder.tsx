import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';
import { NamedNodeFinder } from '../../../components/named-node-finder';
import { FIND_REGIONS_QUERY, QResult, QVars } from './findRegions.query';

interface Props {
  region: NamedNode | null;
  onChange: (region: NamedNode | null) => void;
  // Set to undefined if selection is required
  clearSelectionTitle?: string;
}

export class RegionFinder extends React.PureComponent<Props> {
  getVariables = (input: string | null): QVars => ({
    filter: {
      search: input || '',
    },
    page: { limit: 5 },
  });

  getNodes = (result?: QResult): NamedNode[] => {
    if (!result) {
      return [];
    }
    return result.regions.nodes || [];
  };

  render() {
    const { region, onChange, clearSelectionTitle } = this.props;
    return (
      <NamedNodeFinder<QResult, QVars>
        clearSelectionTitle={this.props.clearSelectionTitle}
        value={region}
        onChange={onChange}
        query={FIND_REGIONS_QUERY}
        getVariables={this.getVariables}
        getNodes={this.getNodes}
        hintText="Select region"
      />
    );
  }
}
