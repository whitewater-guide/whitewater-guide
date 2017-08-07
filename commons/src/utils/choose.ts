import { ComponentType } from 'react';
import { ComponentEnhancer, createEagerFactory, mapper } from 'recompose';

const identity = <P>(component: ComponentType<P>): ComponentType<P> => component;

export type Chooser<T> = mapper<T, string>;
export type ChooserEnhancer<P> = (component: ComponentType<P>) => ComponentType<P>;
export interface EnhancerMap<P> {
  [option: string]: ChooserEnhancer<P>;
}

/**
 * Choose is like branch from recompose, but with multiple options
 */
export const choose =
  <TOuter>(test: Chooser<TOuter>, hocs: EnhancerMap<TOuter>): ChooserEnhancer<TOuter> =>
    (BaseComponent: ComponentType<any>): ComponentType<TOuter> => {
      const Choose = (props: TOuter) => {
        const option = test(props);
        if (option && hocs[option]) {
          const hoc = hocs[option];
          const enhanced = hoc(BaseComponent);
          const factory = createEagerFactory(enhanced);
          return factory(props);
        }
        const identityFactory = createEagerFactory(identity(BaseComponent));
        const result = identityFactory(props);
        return result;
      };
      // if (process.env.NODE_ENV !== 'production') {
      //   return setDisplayName(wrapDisplayName(BaseComponent, 'choose'))(Choose);
      // }
      return Choose;
};

// Workaround to make TS emit declarations, see https://github.com/Microsoft/TypeScript/issues/9944
let b: ComponentEnhancer<any, any>;
