import React from 'react';

export type DrawerContextType = (open: boolean) => void;

export const DrawerContext = React.createContext<DrawerContextType>(() => {});

export const useDrawer = () => React.useContext(DrawerContext);
