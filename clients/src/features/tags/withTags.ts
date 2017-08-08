import { gql, graphql } from 'react-apollo';
import { WithTags } from '../../ww-commons';

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

interface ChildProps extends WithTags {
  tagsLoading: boolean;
}

export const withTags = (withSlugs = false) => graphql<WithTags, any, ChildProps>(
  allTags,
  {
    options: {
      // TODO: replace reducer with update
      // reducer,
      variables: { withSlugs },
    },
    props: ({ data }) => {
      const { loading, ...tags } = data!;
      return { ...tags, tagsLoading: loading };
    },
  },
);
