// tslint:disable
import 'react-app-polyfill/stable';
import '@testing-library/jest-dom/extend-expect';
import 'raf/polyfill';
import 'url-search-params-polyfill';
import '@testing-library/react/cleanup-after-each';

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
  },
};

// @ts-ignore
global.__GRAPHQL_TYPEDEFS_MODULE__ = require('./test/typedefs');
