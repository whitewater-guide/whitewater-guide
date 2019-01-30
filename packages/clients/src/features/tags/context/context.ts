import { Tag } from '@whitewater-guide/commons';
import React from 'react';

export interface TagsContext {
  tags: Tag[];
  loading: boolean;
}

const defaultContext: TagsContext = { tags: [], loading: false };

export const Context = React.createContext(defaultContext);
export const TagsConsumer = Context.Consumer;
