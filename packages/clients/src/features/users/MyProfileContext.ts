import React from 'react';

// @ts-ignore TODO: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509
export const MyProfileContext = React.createContext(null);
export const Provider: React.ComponentType<any> = MyProfileContext.Provider;
export const MyProfileConsumer: React.ComponentType<any> = MyProfileContext.Consumer;
