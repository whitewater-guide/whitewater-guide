import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { DefaultSectionSearchTerms, Point, Region, Section, SectionSearchTerms } from '../../../ww-commons';
import { queryResultToNode } from '../../apollo';
import { Provider } from './RegionContext';
import { REGION_DETAILS } from './regionDetails.query';
import { RegionContext, RegionState } from './types';

interface Props {
  regionId?: string;
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
    searchTerms: { ...DefaultSectionSearchTerms },
    selectedBounds: null,
  };

  onSectionSelected = (section: Section | null) => this.setState({
    selectedSectionId: section ? section.id : null,
    selectedPOIId: null,
  });

  onPOISelected = (poi: Point | null) => this.setState({
    selectedSectionId: null,
    selectedPOIId: poi ? poi.id : null,
  });

  resetSearchTerms = () => this.setState({ searchTerms: { ...DefaultSectionSearchTerms } });

  setSearchTerms = (searchTerms: SectionSearchTerms) => this.setState({ searchTerms });

  render() {
    const { regionId, renderLoading } = this.props;
    const variables = { regionId };
    return (
      <Query query={REGION_DETAILS} variables={variables} fetchPolicy="cache-and-network">
        {(props: RenderProps) => {
          if (props.loading && renderLoading) {
            return renderLoading();
          }
          const { region } = queryResultToNode<Region, 'region'>(props, 'region');
          const contextValue: RegionContext = {
            region,
            ...this.state,
            onSectionSelected: this.onSectionSelected,
            onPOISelected: this.onPOISelected,
            resetSearchTerms: this.resetSearchTerms,
            setSearchTerms: this.setSearchTerms,
          };
          return (
            <Provider value={contextValue}>
              {this.props.children}
            </Provider>
          );
        }}
      </Query>
    );
  }
}
