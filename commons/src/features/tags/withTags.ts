import { gql, graphql } from 'react-apollo';
import { filter } from 'graphql-anywhere';
import reducer from './tagsListReducer';

const allTags = gql`
  query allTags($withSlugs:Boolean!) {
    supplyTags {
      _id
      name
      slug @include(if: $withSlugs)
    }
    kayakingTags {
      _id
      name
      slug @include(if: $withSlugs)
    }
    hazardsTags {
      _id
      name
      slug @include(if: $withSlugs)
    }
    miscTags {
      _id
      name
      slug @include(if: $withSlugs)
    }
  }
`;

// Filter cannot handle directives - workaround
const filterTags = gql`
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
    hazardsTags {
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

export const withTags = (withSlugs = false) => graphql(
  allTags,
  {
    options: {
      reducer,
      variables: { withSlugs },
    },
    props: ({ data: { loading, ...data } }) => {
      return { ...filter(filterTags, data), tagsLoading: loading };
    },
  },
);
