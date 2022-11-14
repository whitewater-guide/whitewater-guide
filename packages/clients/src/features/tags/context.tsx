import { Tag } from '@whitewater-guide/schema';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { useListTagsQuery } from './listTags.generated';

export interface TagsContext {
  tags: Tag[];
  loading: boolean;
}

const defaultContext: TagsContext = { tags: [], loading: false };

const TagsCtx = createContext(defaultContext);

export const TagsProvider: FC<PropsWithChildren> = ({ children }) => {
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
