import { useRegion } from '@whitewater-guide/clients';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export const EditorRoute: React.FC<RouteProps> = React.memo((props) => {
  const { node } = useRegion();
  if (node && !node.editable) {
    return <Redirect to="/403" />;
  }
  return <Route {...props} />;
});
