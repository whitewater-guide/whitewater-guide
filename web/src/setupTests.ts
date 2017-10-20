import 'url-search-params-polyfill';
import 'raf/polyfill';

import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

window.google = {
  maps: {
    places: {
      Autocomplete: class {}
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

Enzyme.configure({ adapter: new Adapter() });
