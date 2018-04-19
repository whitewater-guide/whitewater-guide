import React from 'react';
import { RegionConsumer, RegionSetter } from './RegionContext';
import { WithRegion } from './types';

type InnerProps<Props> = Props & WithRegion & Partial<RegionSetter>;

export function withRegion<Props>(Component: React.ComponentType<InnerProps<Props>>): React.ComponentType<Props> {

  const Wrapper: React.StatelessComponent<Props> = (props: Props) => (
    <RegionConsumer>
      {({ setRegionId, ...region }) => (
        <Component {...props} region={region} setRegionId={setRegionId} />
      )}
    </RegionConsumer>
  );
  Wrapper.displayName = 'withRegion';

  return Wrapper;
}
