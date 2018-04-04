import React from 'react';

// @ts-ignore TODO: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509
export const RegionContext = React.createContext(null);
export const Provider: React.ComponentType<any> = RegionContext.Provider;
export const RegionConsumer: React.ComponentType<any> = RegionContext.Consumer;
