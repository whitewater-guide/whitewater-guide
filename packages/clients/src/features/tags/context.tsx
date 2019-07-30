import { Tag } from '@whitewater-guide/commons';
import React, { useContext } from 'react';
import { Query, QueryResult } from 'react-apollo';
import { LIST_TAGS, Result } from './listTags.query';

export interface TagsContext {
  tags: Tag[];
  loading: boolean;
}

const defaultContext: TagsContext = { tags: [], loading: false };

export const TagsContext = React.createContext(defaultContext);

export const TagsProvider: React.FC = ({ children }) => (
  <Query query={LIST_TAGS} fetchPolicy="cache-and-network">
    {({ data, loading }: QueryResult<Result, {}>) => {
      const tags = (data && data.tags) || [];
      return (
        <TagsContext.Provider value={{ tags, loading }}>
          {children}
        </TagsContext.Provider>
      );
    }}
  </Query>
);

export const useTags = () => useContext(TagsContext);
