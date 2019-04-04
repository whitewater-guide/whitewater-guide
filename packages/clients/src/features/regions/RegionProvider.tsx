import {
  Point,
  Region,
  Section,
  SectionSearchTerms,
} from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';
import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { queryResultToNode } from '../../apollo';
import { Provider } from './RegionContext';
import { REGION_DETAILS } from './regionDetails.query';
import { RegionContext, RegionState } from './types';

interface Props {
  regionId?: string;
  bannerWidth?: number;
  renderLoading?: () => React.ReactElement<any>;
}

interface Vars {
  regionId?: string;
}

interface Result {
  region: Region;
}

type RenderProps = QueryResult<Result, Vars>;

export class RegionProvider extends React.PureComponent<Props, RegionState> {
  state: RegionState = {
    selectedSectionId: null,
    selectedPOIId: null,
    searchTerms: null,
    selectedBounds: null,
  };

  private _query: DocumentNode;

  constructor(props: Props) {
    super(props);
    this._query = REGION_DETAILS(props.bannerWidth);
  }

  onSectionSelected = (section: Section | null) =>
    this.setState({
      selectedSectionId: section ? section.id : null,
      selectedPOIId: null,
    });

  onPOISelected = (poi: Point | null) =>
    this.setState({
      selectedSectionId: null,
      selectedPOIId: poi ? poi.id : null,
    });

  resetSearchTerms = () => this.setState({ searchTerms: null });

  setSearchTerms = (searchTerms: SectionSearchTerms) =>
    this.setState({ searchTerms });

  render() {
    const { regionId, renderLoading, bannerWidth } = this.props;
    const variables = { regionId };
    return (
      <Query
        query={this._query}
        variables={variables}
        fetchPolicy="cache-and-network"
      >
        {(props: RenderProps) => {
          if (props.loading && renderLoading) {
            return renderLoading();
          }
          const { region } = queryResultToNode<Region, 'region'>(
            props,
            'region',
          );
          const contextValue: RegionContext = {
            region,
            ...this.state,
            onSectionSelected: this.onSectionSelected,
            onPOISelected: this.onPOISelected,
            resetSearchTerms: this.resetSearchTerms,
            setSearchTerms: this.setSearchTerms,
          };
          return (
            <Provider value={contextValue}>{this.props.children}</Provider>
          );
        }}
      </Query>
    );
  }
}
