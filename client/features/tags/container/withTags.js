import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const allTags = gql`
  query allTags {
    supplyTags {
      _id
      name
      slug
    }
    kayakingTags {
      _id
      name
      slug
    }
    hazardTags {
      _id
      name
      slug
    }
    miscTags {
      _id
      name
      slug
    }
  }
`;

export const withTags = graphql(
  allTags,
  {
    props: ({data: {hazardTags, kayakingTags, miscTags, supplyTags, loading}}) => ({
      hazardTags, kayakingTags, miscTags, supplyTags, tagsLoading: loading
    }),
  },
);