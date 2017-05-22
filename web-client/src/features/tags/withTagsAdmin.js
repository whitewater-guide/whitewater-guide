import { gql, graphql, compose } from 'react-apollo';

const RemoveTagMutation = gql`
  mutation removeTag($category: String!, $_id: ID!){
    removeTag(category: $category, _id: $_id)
  }
`;

const UpsertTagMutation = gql`
  mutation upsertTag($tag: TagInput!, $language: String){
    upsertTag(tag: $tag, language: $language){
      _id,
      name,
      slug,
    }
  }
`;

export default compose(
  graphql(
    RemoveTagMutation, {
      props: ({ mutate }) => ({
        removeTag: (category, _id) => mutate({ variables: { category, _id } }),
      }),
    },
  ),
  graphql(
    UpsertTagMutation, {
      props: ({ mutate }) => ({
        upsertTag: tag => mutate({ variables: { tag } }),
      }),
    },
  ),
);
