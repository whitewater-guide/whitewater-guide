import { useAuth, useRegion } from '@whitewater-guide/clients';
import React from 'react';

interface Props {
  children: React.ReactElement;
}

/**
 * Component that render its children only if the user (consumed from context) is admin
 * Or the component is in region context and the region is editable for current user
 * Or the component is not in region context, but the user is an editor somewhere
 */
export const EditorOnly: React.FC<Props> = ({ children }) => {
  const { me } = useAuth();
  const region = useRegion();
  if (!me) {
    return null;
  }
  if (me.admin) {
    return React.Children.only(children);
  }
  if (!region) {
    return me.editor ? React.Children.only(children) : null;
  }
  return region.editable ? React.Children.only(children) : null;
};
