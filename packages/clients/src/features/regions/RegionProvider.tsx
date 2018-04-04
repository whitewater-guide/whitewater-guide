import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Region } from '../../../ww-commons';
import { queryResultToNode } from '../../apollo';
import { Provider } from './RegionContext';
import { REGION_DETAILS } from './regionDetails.query';

interface Props {
  regionId: string;
  renderLoading: () => React.ReactElement<any>;
}

interface Vars {
  regionId: string;
}

interface Result {
  region: Region;
}

type RenderProps = QueryResult<Result, Vars>;

export class RegionProvider extends React.PureComponent<Props> {
  render() {
    const { renderLoading, regionId } = this.props;
    const variables = { regionId };
    return (
      <Query query={REGION_DETAILS} variables={variables} fetchPolicy="cache-and-network">
        {(props: RenderProps) => {
          if (props.loading) {
            return renderLoading();
          }
          const { region } = queryResultToNode(props, 'region');
          return (
            <Provider value={region}>
              {this.props.children}
            </Provider>
          );
        }}
      </Query>
    );
  }
}
