import React from 'react';
import { User } from '../../../ww-commons';

interface ContextState {
  me: User | null;
  loading: boolean;
}

export const MyProfileContext = React.createContext<ContextState>({ me: null, loading: false });
export const Provider = MyProfileContext.Provider;
export const MyProfileConsumer = MyProfileContext.Consumer;
