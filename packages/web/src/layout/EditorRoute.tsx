import { useRegion } from '@whitewater-guide/clients';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export const EditorRoute = React.memo((props: RouteProps) => {
  const { node } = useRegion();
  if (node && !node.editable) {
    return <Redirect to="/403" />;
  }
  return <Route {...props} />;
});

EditorRoute.displayName = 'EditorRoute';
