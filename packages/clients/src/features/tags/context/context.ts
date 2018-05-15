import React from 'react';
import { Tag } from '../../../../ww-commons';

export interface TagsContext {
  tags: Tag[];
  loading: boolean;
}

const defaultContext: TagsContext = { tags: [], loading: false };

export const Context = React.createContext(defaultContext);
export const TagsConsumer = Context.Consumer;
