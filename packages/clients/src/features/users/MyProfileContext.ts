import { User } from '@whitewater-guide/commons';
import React from 'react';

interface ContextState {
  me: User | null;
  loading: boolean;
}

export const MyProfileContext = React.createContext<ContextState>({
  me: null,
  loading: false,
});
export const Provider = MyProfileContext.Provider;
export const MyProfileConsumer = MyProfileContext.Consumer;
