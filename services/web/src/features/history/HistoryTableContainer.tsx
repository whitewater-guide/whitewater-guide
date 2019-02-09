import { NamedNode } from '@whitewater-guide/commons';
import React from 'react';
import { Query } from 'react-apollo';
import { AutoSizer } from 'react-virtualized';
import { Loading } from '../../components';
import HistoryTable from './HistoryTable';
import { QResult, QVars, SECTONS_EDIT_HISTORY_QUERY } from './query';

interface State {
  user: NamedNode | null;
  region: NamedNode | null;
}

interface Props {
  onDiffOpen: (diff: object | null) => void;
}

class HistoryTableContainer extends React.PureComponent<Props, State> {
  readonly state: State = { user: null, region: null };

  onUserChange = (user: NamedNode | null) => {
    this.setState({ user });
  };

  onRegionChange = (region: NamedNode | null) => {
    this.setState({ region });
  };

  render(): React.ReactNode {
    const { user, region } = this.state;
    const variables: QVars = { filter: {} };
    if (user) {
      variables.filter!.editorId = user.id;
    }
    if (region) {
      variables.filter!.regionId = region.id;
    }
    // TODO: pagination
    return (
      <Query<QResult, QVars>
        fetchPolicy="network-only"
        query={SECTONS_EDIT_HISTORY_QUERY}
        variables={variables}
      >
        {({ data, loading }) => {
          if (loading || !data) {
            return <Loading />;
          }
          const history = data.history || [];
          return (
            <AutoSizer rowCount={history ? history.length : 0}>
              {({ width, height }) => (
                <HistoryTable
                  user={user}
                  onUserChange={this.onUserChange}
                  region={region}
                  onRegionChange={this.onRegionChange}
                  history={history}
                  height={height}
                  width={width}
                  onDiffOpen={this.props.onDiffOpen}
                />
              )}
            </AutoSizer>
          );
        }}
      </Query>
    );
  }
}

export default HistoryTableContainer;
