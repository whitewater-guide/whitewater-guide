import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';

import type { SearchContexts } from './types';

type MaybeSearch = undefined | ((v: string) => void);

const defaultSearchStringCtx = createContext('');
const defaultSearchSetterCtx = createContext<MaybeSearch>(undefined);

export interface HeaderSearchProps {
  available: boolean;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  searchInputRef: React.RefObject<TextInput | null>;
}

export const useHeaderSearch = (
  searchContexts?: SearchContexts,
): HeaderSearchProps => {
  const searchInputRef = useRef<TextInput>(null);
  const [active, setActive] = useState(false);

  const searchString = useContext(
    searchContexts ? searchContexts[0] : defaultSearchStringCtx,
  );

  const setSearchString = useContext<MaybeSearch>(
    searchContexts
      ? (searchContexts[1] as React.Context<MaybeSearch>)
      : defaultSearchSetterCtx,
  );

  const [searchInput, setSearchInput] = useState(searchString);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (setSearchString) {
        setSearchString(searchInput);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput, setSearchString]);

  useEffect(() => {
    if (active && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [active]);

  return {
    available: !!searchContexts,
    active,
    setActive,
    searchInput,
    setSearchInput,
    searchInputRef,
  };
};
