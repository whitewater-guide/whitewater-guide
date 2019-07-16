import { useAuth, useRegion } from '@whitewater-guide/clients';
import React from 'react';

/**
 * Component that render its children only if the user (consumed from context) is admin
 * Or the component is in region context and the region is editable for current user
 * @param {React.ReactNode} children
 * @returns {any}
 * @constructor
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
  if (!node || !node.editable) {
    return null;
  }
  return children as any;
};
