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
          const innerProps: Props & T = { ...props as any, ...selected as any };
          return (
            <Component {...innerProps} />
          );
        }}
      </RegionConsumer>
    );
    Wrapper.displayName = 'consumeRegion';

    return Wrapper;
  };
}
