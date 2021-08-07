import { fragmentTypes } from '@whitewater-guide/schema';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: fragmentTypes,
});

export default fragmentMatcher;
