import gql from 'graphql-tag';

const FIND_USERS_QUERY = gql`
  query findUsers($inputValue: String!) {
    users: findUsers(search: $inputValue) {
      id
      name
    }
  }
`;

export default FIND_USERS_QUERY;
