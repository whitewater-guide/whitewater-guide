import type Mapbox from '@rnmapbox/maps';
import noop from 'lodash/noop';
import type { FC, MutableRefObject, PropsWithChildren } from 'react';
import React, { useContext, useState } from 'react';

type CameraSetter = (value: Mapbox.Camera | null) => void;

const CameraContext = React.createContext<Mapbox.Camera | null>(null);
const CameraSetterContext = React.createContext<CameraSetter>(noop);

interface Props {
  cameraRef?: MutableRefObject<Mapbox.Camera | null>;
}

export const CameraProvider: FC<PropsWithChildren<Props>> = React.memo(
  ({ cameraRef, children }) => {
    const [camera, setCamera] = useState<Mapbox.Camera | null>(null);
    if (cameraRef) {
      cameraRef.current = camera;
    }
    return (
      <CameraSetterContext.Provider value={setCamera}>
        <CameraContext.Provider value={camera}>
          {children}
        </CameraContext.Provider>
      </CameraSetterContext.Provider>
    );
  },
);

CameraProvider.displayName = 'CameraProvider';

export const useCameraSetter = () => useContext(CameraSetterContext);
export const useCamera = () => useContext(CameraContext);
