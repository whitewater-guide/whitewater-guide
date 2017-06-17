import { flattenProp, mapProps, hoistStatics } from 'recompose';

const container = mapProps(props => ({
  htmlText: JSON.stringify(props, null, 2),
}));

export default hoistStatics(container);