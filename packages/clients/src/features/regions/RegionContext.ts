import { NetworkStatus } from 'apollo-client';
import React from 'react';
import { RegionContext } from './types';

const defaultValue: RegionContext = {
  region: {
    loading: false,
    node: null,
    networkStatus: NetworkStatus.ready,
    refetch: () => Promise.reject('Default context value cannot be refetched'),
  },

  selectedSectionId: null,
  onSectionSelected: () => {},

  selectedPOIId: null,
  onPOISelected: () => {},

  searchTerms: null,
  resetSearchTerms: () => {},
  setSearchTerms: () => {},

  selectedBounds: null,
};

const context = React.createContext<RegionContext>(defaultValue);
export const Provider = context.Provider;
export const RegionConsumer = context.Consumer;
