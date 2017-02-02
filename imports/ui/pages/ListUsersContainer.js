import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import adminOnly from '../hoc/adminOnly';

const ListUsersQuery = gql`
  query listUsers {
    listUsers {
      _id,
      email,
      profile {
        name,
        link,
      },
      roles,
    }
  }
`;

const ToggleAdminMutation = gql`
  mutation toggleAdmin($_id: ID!, $isAdmin: Boolean!){
    toggleAdmin(_id: $_id, isAdmin: $isAdmin){
      _id,
      roles,
    }
  }
`;

export default compose(
  adminOnly,
  graphql(
    ListUsersQuery, {
      props: ({data: {listUsers}}) => ({users: listUsers || []})
    }
  ),
  graphql(
    ToggleAdminMutation, {
      props: ({mutate}) => ({toggleAdmin: (userId, isAdmin) => mutate({
        variables: {_id: userId, isAdmin},
      })}),
    }
  )
);