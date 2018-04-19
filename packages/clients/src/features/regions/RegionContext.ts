import React from 'react';
import { Region } from '../../../ww-commons';
import { WithNode } from '../../apollo';

export const RegionContext = React.createContext<WithNode<Region> | null>(null);
export const Provider = RegionContext.Provider;
export const RegionConsumer = RegionContext.Consumer;
