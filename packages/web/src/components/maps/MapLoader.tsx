import { Loader } from '@googlemaps/js-api-loader';
import React, { FC, useEffect, useState } from 'react';

import { Loading } from '../Loading';

const _loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  libraries: ['places', 'drawing'],
});

let _loaded = false;

const MapLoader: FC = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (_loaded) {
      setLoaded(true);
      return;
    }
    _loader.load().then(() => {
      _loaded = true;
      setLoaded(true);
    });
  }, [setLoaded]);

  return loaded ? <>{children}</> : <Loading />;
};

export default MapLoader;
