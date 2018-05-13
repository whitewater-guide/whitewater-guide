import React from 'react';
import { RegionConsumer } from './RegionContext';
import { RegionContext, WithRegion } from './types';

type RegionSelector<T = WithRegion> = (state: RegionContext) => T;

const defaultSelector: RegionSelector = ({ region }) => ({ region });

export function consumeRegion<T = WithRegion>(selector?: RegionSelector<T>) {
  const select = selector || defaultSelector;
  // tslint:disable-next-line:only-arrow-functions
  return function <Props>(Component: React.ComponentType<Props & T>): React.ComponentType<Props> {
    const Wrapper: React.StatelessComponent<Props> = (props: Props) => (
      <RegionConsumer>
        {(state: RegionContext) => {
          const selected = select(state);
          return (
            <Component {...props} {...selected} />
          );
        }}
      </RegionConsumer>
    );
    Wrapper.displayName = 'consumeRegion';

    return Wrapper;
  };
}
