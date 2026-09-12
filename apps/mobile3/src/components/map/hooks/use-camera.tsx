import type Mapbox from '@rnmapbox/maps';
import type { FC, MutableRefObject, PropsWithChildren } from 'react';
import { createContext, memo, useContext, useState } from 'react';

type CameraSetter = (value: Mapbox.Camera | null) => void;

function noop(_value: Mapbox.Camera | null) {
  // default context setter
}

const CameraContext = createContext<Mapbox.Camera | null>(null);
const CameraSetterContext = createContext<CameraSetter>(noop);

export interface CameraProviderProps {
  cameraRef?: MutableRefObject<Mapbox.Camera | null>;
}

export const CameraProvider: FC<PropsWithChildren<CameraProviderProps>> = memo(
  ({ cameraRef, children }) => {
    const [camera, setCamera] = useState<Mapbox.Camera | null>(null);
    if (cameraRef) {
      cameraRef.current = camera;
    }
    return (
      <CameraSetterContext.Provider value={setCamera}>
        <CameraContext.Provider value={camera}>{children}</CameraContext.Provider>
      </CameraSetterContext.Provider>
    );
  },
);

CameraProvider.displayName = 'CameraProvider';

export const useCameraSetter = () => useContext(CameraSetterContext);
export const useCamera = () => useContext(CameraContext);
