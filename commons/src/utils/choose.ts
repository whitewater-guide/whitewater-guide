import { ComponentType } from 'react';
import { createEagerFactory, mapper } from 'recompose';

const identity = <P>(component: ComponentType<P>): ComponentType<P> => component;

type Chooser<T> = mapper<T, string>;
type Enhancer<P> = (component: ComponentType<P>) => ComponentType<P>;
interface EnhancerMap<P> {
  [option: string]: Enhancer<P>;
}

const choose =
  <TOuter>(test: Chooser<TOuter>, hocs: EnhancerMap<TOuter>): Enhancer<TOuter> =>
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

/**
 * Choose is like branch from recompose, but with multiple options
 */
export default choose;
