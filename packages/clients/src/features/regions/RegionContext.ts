import { NetworkStatus } from 'apollo-client';
import React from 'react';
import { Region } from '../../../ww-commons';
import { WithNode } from '../../apollo';

export interface RegionSetter {
  setRegionId: (regionId?: string) => void;
}

export type RegionContextValue = WithNode<Region | null> & RegionSetter;

const defaultValue: RegionContextValue = {
  setRegionId: () => {/*nothing*/},
  loading: false,
  node: null,
  networkStatus: NetworkStatus.ready,
  refetch: () => Promise.reject('Default context value cannot be refetched'),
};

export const RegionContext = React.createContext<RegionContextValue>(defaultValue);
export const Provider = RegionContext.Provider;
export const RegionConsumer = RegionContext.Consumer;
