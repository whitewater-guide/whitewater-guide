import gql from 'graphql-tag';
import {graphql, withApollo} from 'react-apollo';
import {compose} from 'recompose';

const myProfile = gql`
  query myProfile {
    me {
      _id
      email
      profile {
        id
        name
        link
      }
      roles
    }
  }
`;

export default compose(
  withApollo,
  graphql(
    myProfile,
    {
      options: () => ({notifyOnNetworkStatusChange: true}),
      props: ({data: {me, loading}} ) => {
        return {user: me, loading};
      }
    }
  ),
);