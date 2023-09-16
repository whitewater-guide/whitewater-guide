import { useRegion } from '@whitewater-guide/clients';
import React from 'react';
import type { RouteProps } from 'react-router-dom';
import { Redirect, Route } from 'react-router-dom';

export const EditorRoute = React.memo((props: RouteProps) => {
  const region = useRegion();
  if (region && !region.editable) {
    return <Redirect to="/403" />;
  }
  return <Route {...props} />;
});

EditorRoute.displayName = 'EditorRoute';
