import { Tag } from '@whitewater-guide/commons';
import React, { useContext } from 'react';
import { Query, QueryResult } from 'react-apollo';

import { LIST_TAGS, Result } from './listTags.query';

export interface TagsContext {
  tags: Tag[];
  loading: boolean;
}

const defaultContext: TagsContext = { tags: [], loading: false };

const TagsCtx = React.createContext(defaultContext);

export const TagsProvider: React.FC = ({ children }) => {
  return (
    <Query query={LIST_TAGS} fetchPolicy="cache-and-network">
      {({ data, loading }: QueryResult<Result, unknown>) => {
        const tags = (data && data.tags) || [];
        return (
          <TagsCtx.Provider value={{ tags, loading }}>
            {children}
          </TagsCtx.Provider>
        );
      }}
    </Query>
  );
};

export const useTags = () => useContext(TagsCtx);
