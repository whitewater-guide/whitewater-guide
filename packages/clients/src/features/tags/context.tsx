import { Tag } from '@whitewater-guide/schema';
import React, { useContext, useMemo } from 'react';

import { useListTagsQuery } from './listTags.generated';

export interface TagsContext {
  tags: Tag[];
  loading: boolean;
}

const defaultContext: TagsContext = { tags: [], loading: false };

const TagsCtx = React.createContext(defaultContext);

export const TagsProvider: React.FC = ({ children }) => {
  const { data, loading } = useListTagsQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });
  const value = useMemo<TagsContext>(
    () => ({ tags: data?.tags ?? [], loading }),
    [data, loading],
  );
  return <TagsCtx.Provider value={value}>{children}</TagsCtx.Provider>;
};

export const useTags = () => useContext(TagsCtx);
