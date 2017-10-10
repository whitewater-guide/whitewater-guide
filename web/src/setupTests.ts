import 'url-search-params-polyfill';

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
