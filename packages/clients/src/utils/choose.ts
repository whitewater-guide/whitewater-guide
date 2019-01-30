import { ComponentType, createElement } from 'react';
import { ComponentEnhancer, createEagerFactory, mapper } from 'recompose';

type Chooser<T> = mapper<T, string>;
type ChooserEnhancer<P> = (component: ComponentType<P>) => ComponentType<P>;
interface EnhancerMap<P> {
  [option: string]: ChooserEnhancer<P>;
}

/**
 * Choose is like branch from recompose, but with multiple options
 */
export const choose = <TOuter>(
  test: Chooser<TOuter>,
  hocs: EnhancerMap<TOuter>,
): ChooserEnhancer<TOuter> => (
  BaseComponent: ComponentType<any>,
): ComponentType<TOuter> => {
  const Choose = (props: TOuter) => {
    const option = test(props);
    if (option && hocs[option]) {
      const hoc = hocs[option];
      const enhanced = hoc(BaseComponent);
      return createElement(enhanced, props);
    }
    return createElement(BaseComponent, props);
  };
  return Choose;
};
