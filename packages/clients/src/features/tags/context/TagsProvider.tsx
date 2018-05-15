import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { LIST_TAGS, Result } from '../listTags.query';
import { Context } from './context';

export const TagsProvider: React.SFC = ({ children }) => (
  <Query query={LIST_TAGS} fetchPolicy="cache-and-network">
    {({ data, loading }: QueryResult<Result, {}>) => {
      const tags = data ? data.tags : [];
      return (
        <Context.Provider value={{ tags: tags || [], loading }}>
          {children}
        </Context.Provider>
      );
    }}
  </Query>
);
