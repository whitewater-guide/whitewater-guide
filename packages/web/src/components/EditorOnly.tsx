import { useAuth, useRegion } from '@whitewater-guide/clients';
import React from 'react';

/**
 * Component that render its children only if the user (consumed from context) is admin
 * Or the component is in region context and the region is editable for current user
 * Or the component is not in region context, but the user is an editor somewhere
 */
export const EditorOnly: React.FC = ({ children }) => {
  const { me } = useAuth();
  const { node } = useRegion();
  if (!me) {
    return null;
  }
  if (me.admin) {
    return children as any;
  }
  if (!node) {
    return me.editor ? children : null;
  }
  return node.editable ? children : null;
};
