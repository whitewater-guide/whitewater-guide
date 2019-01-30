// tslint:disable
import 'raf/polyfill';
import 'url-search-params-polyfill';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.google = {
  maps: {
    places: {
      Autocomplete: class {},
    },
    LatLng: class {},
    LatLngLiteral: {},
    Data: {
      Geometry: class {},
      LineString: class {},
      Point: class {},
      Polygon: class {},
      Feature: class {},
    },
  },
};

// @ts-ignore
global.__GRAPHQL_TYPEDEFS_MODULE__ = require('./test/typedefs');

Enzyme.configure({ adapter: new Adapter() });
