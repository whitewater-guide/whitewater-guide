import { MyProfileConsumer, RegionConsumer } from '@whitewater-guide/clients';
import React from 'react';

/**
 * Component that render its children only if the user (consumed from context) is admin
 * Or the component is in region context and the region is editable for current user
 * @param {React.ReactNode} children
 * @returns {any}
 * @constructor
 */
export const EditorOnly: React.StatelessComponent = ({ children }) => (
  <MyProfileConsumer>
    {({ me }) => {
      if (!me) {
        return null;
      }
      if (me.admin) {
        return children;
      }
      return (
        <RegionConsumer>
          {({ region }) => {
            if (!region.node) {
              return null;
            }
            return region.node.editable ? children : null;
          }}
        </RegionConsumer>
      );
    }}
  </MyProfileConsumer>
);
