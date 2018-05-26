import { GraphQLError } from 'graphql';
import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { BoomPromoInfo } from '../../ww-commons';
import { CHECK_BOOM_PROMO_QUERY, Result } from './checkBoomPromo.query';

interface RenderProps {
  checkBoomPromo: () => void;
  loading: boolean;
  errors?: Error[];
  data: BoomPromoInfo | null;
}

interface Props {
  code: string;
  children: (props: RenderProps) => React.ReactNode;
  onLoaded: (data: BoomPromoInfo | null, errors?: GraphQLError[]) => void;
}

interface State {
  loading: boolean;
  data: Result | null;
  errors?: Error[];
}

class Query extends React.PureComponent<WithApolloClient<Props>, State> {
  state: State = {
    loading: false,
    data: null,
  };

  checkBoomPromo = async () => {
    const { client, code, onLoaded } = this.props;
    this.setState({ loading: true });
    try {
      const { data, errors } = await client.query<Result>({
        query: CHECK_BOOM_PROMO_QUERY,
        variables: { code },
        fetchPolicy: 'network-only',
      });
      this.setState({
        loading: false,
        errors,
        data,
      });
      onLoaded(data ? data.checkBoomPromo : null, errors);
    } catch (e) {
      this.setState({
        loading: false,
        errors: [e],
        data: null,
      });
      onLoaded(null, [e]);
    }
  };

  render() {
    const { loading, errors, data } = this.state;
    return this.props.children({
      loading,
      errors,
      data: data ? data.checkBoomPromo : null,
      checkBoomPromo: this.checkBoomPromo,
    });
  }
}

export default withApollo(Query);
