import { EnzymeSelector, ShallowRendererProps, ShallowWrapper } from 'enzyme';

// https://gist.github.com/matthieuprat/5fd37abbd4a4002e6cfe0c73ae54cda8
export function shallowRecursively(
  wrapper: ShallowWrapper<any, any>,
  selector?: EnzymeSelector,
  options?: ShallowRendererProps,
): ShallowWrapper<any, any> {
  let context = options ? options.context : undefined;
  // Do not try to shallow render empty nodes and host elements
  // (a.k.a primitives). Simply return the wrapper in that case.
  if (wrapper.isEmptyRender() || typeof (wrapper as any).node.type === 'string') {
    return wrapper;
  }

  // Retrieve the context so that we can pass it down to the next wrapper.
  const instance = (wrapper as any).root.instance();
  if (instance.getChildContext) {
    context = { ...context, ...instance.getChildContext() };
  }

  const nextWrapper = wrapper.shallow({ context });

  return selector && wrapper.is(selector)
    ? nextWrapper
    : shallowRecursively(nextWrapper, selector, { context });
}
