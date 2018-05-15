import { graphql } from 'react-apollo';
import { WithTags } from '../../../ww-commons';
import { LIST_TAGS, Result } from './listTags.query';

export const withTags = (cached = true) => graphql<any, Result, any, WithTags>(
  LIST_TAGS,
  {
    options: () => ({
      fetchPolicy: cached ? 'cache-first' : 'network-only',
    }),
    props: ({ data }) => {
      const { loading, tags } = data!;
      return { tags: tags!, tagsLoading: loading };
    },
  },
);
