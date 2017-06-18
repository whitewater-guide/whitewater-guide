import { setDisplayName, wrapDisplayName, createEagerFactory } from 'recompose';

const identity = Component => Component;

const choose = (test, hocs) => (BaseComponent) => {
  const Choose = (props) => {
    const option = test(props);
    if (option && hocs[option]) {
      const hoc = hocs[option];
      const factory = createEagerFactory(hoc(BaseComponent));
      return factory(props);
    }
    const identityFactory = createEagerFactory(identity(BaseComponent));
    return identityFactory(props);
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'choose'))(Choose);
  }
  return Choose;
};

/**
 * Choose is like branch from recompose, but with multiple options
 */
export default choose;
