import { Loader } from '@googlemaps/js-api-loader';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { Loading } from '../Loading';

const _loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  libraries: ['places', 'drawing'],
});

let _loaded = false;

interface Props {
  children: React.ReactElement;
}

const MapLoader: FC<Props> = ({ children }) => {
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

  return loaded ? React.Children.only(children) : <Loading />;
};

export default MapLoader;
