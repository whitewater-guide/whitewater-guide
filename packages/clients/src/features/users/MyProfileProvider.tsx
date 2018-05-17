import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { MY_PROFILE_QUERY } from './myProfile.query';
import { Provider } from './MyProfileContext';
import { WithMe } from './types';

interface Props {
  renderLoading?: () => React.ReactNode;
}

type RenderProps = QueryResult<WithMe, {}>;

export class MyProfileProvider extends React.PureComponent<Props> {
  render() {
    const { renderLoading } = this.props;
    return (
      <Query query={MY_PROFILE_QUERY} fetchPolicy="cache-and-network">
        {({ data, loading }: RenderProps) => {
          if (renderLoading && loading) {
            const loadingNode = renderLoading();
            if (loadingNode) {
              return loadingNode;
            }
          }
          const me = data ? data.me : null;
          return (
            <Provider value={{ me, loading }}>
              {this.props.children}
            </Provider>
          );
        }}
      </Query>
    );
  }
}
