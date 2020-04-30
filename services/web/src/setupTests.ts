// tslint:disable
import '@testing-library/jest-dom/extend-expect';
import 'raf/polyfill';
import 'react-app-polyfill/stable';
import 'url-search-params-polyfill';

import { initYup } from '@whitewater-guide/validation';

initYup();

window.google = {
  maps: {
    places: {
      Autocomplete: class {},
    },
    LatLng: class {},
    LatLngBounds: class {},
    LatLngLiteral: {},
    Data: {
      Geometry: class {},
      LineString: class {},
      Point: class {},
      Polygon: class {},
      Feature: class {},
    },
    Size: class {},
    Point: class {},
  },
};

// @ts-ignore
global.__GRAPHQL_TYPEDEFS_MODULE__ = require('./test/typedefs');
