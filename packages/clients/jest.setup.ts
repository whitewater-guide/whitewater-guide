import 'raf/polyfill';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
// @ts-ignore
global.__GRAPHQL_TYPEDEFS_MODULE__ = require('./src/test/typedefs');
