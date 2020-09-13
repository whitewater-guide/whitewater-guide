import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import useDebounce from 'react-use/lib/useDebounce';

import { SearchContexts } from './types';

type MaybeSearch = undefined | ((v: string) => void);

const defaultSearchStringCtx = createContext('');
const defaultSearchSetterCtx = createContext<MaybeSearch>(undefined);

export interface HeaderSearchProps {
  available: boolean;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  searchInputRef: React.RefObject<TextInput>;
}

export const useHeaderSearch = (
  searchContexts?: SearchContexts,
): HeaderSearchProps => {
  const searchInputRef = useRef<TextInput>() as any;
  const [active, setActive] = useState(false);

  const searchString = useContext(
    searchContexts ? searchContexts[0] : defaultSearchStringCtx,
  );

  const setSearchString = useContext<MaybeSearch>(
    searchContexts ? searchContexts[1] : (defaultSearchSetterCtx as any),
  );

  const [searchInput, setSearchInput] = useState(searchString);

  useDebounce(
    () => {
      if (setSearchString) {
        setSearchString(searchInput);
      }
    },
    200,
    [searchInput, setSearchString],
  );

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
