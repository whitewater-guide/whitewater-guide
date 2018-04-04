import React from 'react';
import { Region } from '../../../ww-commons';
import { WithNode } from '../../apollo';
import { RegionConsumer } from './RegionContext';
import { WithRegion } from './types';

export function withRegion<Props>(Component: React.ComponentType<Props & WithRegion>): React.ComponentType<Props> {

  const Wrapper: React.StatelessComponent<Props> = (props: Props) => (
    <RegionConsumer>
      {(regionNode: WithNode<Region>) => <Component {...props} region={regionNode} />}
    </RegionConsumer>
  );
  Wrapper.displayName = 'withRegion';

  return Wrapper;
}
