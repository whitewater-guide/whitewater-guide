import React from 'react';
import { WithNode } from '../ww-clients/apollo';
import { RegionConsumer } from '../ww-clients/features/regions';
import { MyProfileConsumer } from '../ww-clients/features/users';
import { Region, User } from '../ww-commons';

/**
 * Component that render its children only if the user (consumed from context) is admin
 * Or the component is in region context and the region is editable for current user
 * @param {React.ReactNode} children
 * @returns {any}
 * @constructor
 */
export const EditorOnly: React.StatelessComponent = ({ children }) => (
  <MyProfileConsumer>
    {(me: User | null) => {
      if (!me) {
        return null;
      }
      if (me.admin) {
        return children;
      }
      return (
        <RegionConsumer>
          {(region: WithNode<Region> | null) => {
            if (!region) {
              return null;
            }
            return region.node.editable ? children : null;
          }}
        </RegionConsumer>
      );
    }}
  </MyProfileConsumer>
);
