import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Region } from '../../../ww-commons';
import { queryResultToNode } from '../../apollo';
import { Provider, RegionContextValue } from './RegionContext';
import { REGION_DETAILS } from './regionDetails.query';

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

interface State {
  regionId?: string;
  setRegionId: (regionId?: string) => void;
}

export class RegionProvider extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      regionId: props.regionId,
      setRegionId: this.setRegionId,
    };
  }

  setRegionId = (regionId?: string) => this.setState({ regionId });

  render() {
    const { renderLoading } = this.props;
    const { regionId } = this.state;
    const variables = { regionId };
    return (
      <Query query={REGION_DETAILS} variables={variables} fetchPolicy="cache-and-network">
        {(props: RenderProps) => {
          if (props.loading && renderLoading) {
            return renderLoading();
          }
          const { region } = queryResultToNode<Region, 'region'>(props, 'region');
          const contextValue: RegionContextValue = {
            ...region,
            setRegionId: this.setRegionId,
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
