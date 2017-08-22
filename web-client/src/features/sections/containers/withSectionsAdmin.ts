import { graphql, gql } from 'react-apollo';
import { branch } from 'recompose';

const RemoveSectionMutation = gql`
  mutation removeSection($_id: ID!){
    removeSection(_id: $_id)
  }
`;

export const withSectionsAdmin = branch(
  props => props.admin,
  graphql(
    RemoveSectionMutation,
    {
      props: ({ mutate }) => ({
        removeSection: _id => mutate({ variables: { _id } }),
      }),
    },
  ),
);
