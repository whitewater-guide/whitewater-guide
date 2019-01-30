import { WithTags } from '@whitewater-guide/commons';
import { graphql } from 'react-apollo';
import { LIST_TAGS, Result } from './listTags.query';

export const withTags = (cached = true) =>
  graphql<any, Result, any, WithTags>(LIST_TAGS, {
    options: () => ({
      fetchPolicy: cached ? 'cache-first' : 'network-only',
    }),
    props: ({ data }) => {
      const { loading, tags } = data!;
      return { tags: tags!, tagsLoading: loading };
    },
  });
