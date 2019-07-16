const original = jest.requireActual('@react-native-mapbox-gl/maps');

const offlineManager = {
  createPack: jest.fn(),
  deletePack: jest.fn(),
  getPacks: jest.fn(),
  getPack: jest.fn(),
  setTileCountLimit: jest.fn(),
  setProgressEventThrottle: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
};

const locationManager = {
  getLastKnownLocation: jest.fn(),
};

export default {
  ...original,
  offlineManager,
  locationManager,
};
