import Mapbox from '@react-native-mapbox-gl/maps';
import { Coordinate2d, ensureAltitude } from '@whitewater-guide/clients';
import { SectionInput } from '@whitewater-guide/schema';
import round from 'lodash/round';
import {
  MutableRefObject,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import notifier from './notifier';

export interface PiToState {
  shape: [CodegenCoordinates | undefined, CodegenCoordinates | undefined];
  selected: -1 | 0 | 1;
}

type Action =
  | { type: 'select'; selected: PiToState['selected'] }
  | { type: 'move'; coordinate: CodegenCoordinates }
  | { type: 'set'; shape: [CodegenCoordinates, CodegenCoordinates] };

const reducer = (state: PiToState, action: Action): PiToState => {
  if (action.type === 'select') {
    return { ...state, selected: action.selected };
  }
  if (action.type === 'move') {
    if (state.selected === -1) {
      return state;
    }
    const shape: PiToState['shape'] = [...state.shape] as any;
    shape[state.selected] = ensureAltitude(action.coordinate).map((n) =>
      round(n, 4),
    ) as CodegenCoordinates;
    return { ...state, shape };
  }
  if (action.type === 'set') {
    return { ...state, shape: ensureAltitude(action.shape) as any };
  }
  return state;
};

const initState = (initialShape: SectionInput['shape']): PiToState => ({
  selected: -1,
  shape: [initialShape[0], initialShape[initialShape.length - 1]],
});

interface Hook {
  state: PiToState;
  select: (selected: PiToState['selected']) => void;
  move: (coordinate: CodegenCoordinates) => void;
  set: (shape: [CodegenCoordinates, CodegenCoordinates]) => void;
  mapRef: MutableRefObject<Mapbox.MapView | null>;
}

export const usePiToState = (initialShape: SectionInput['shape']): Hook => {
  const mapRef = useRef<Mapbox.MapView | null>(null);
  const [state, dispatch] = useReducer(reducer, initialShape, initState);
  const actions = useMemo(
    () => ({
      select: (selected: PiToState['selected']) => {
        if (mapRef.current && selected === -1) {
          mapRef.current.getCenter().then((coordinate: Coordinate2d) => {
            dispatch({ type: 'move', coordinate });
          });
        }
        dispatch({ type: 'select', selected });
      },
      move: (coordinate: CodegenCoordinates) =>
        dispatch({ type: 'move', coordinate }),
      set: (shape: [CodegenCoordinates, CodegenCoordinates]) =>
        dispatch({ type: 'set', shape }),
    }),
    [dispatch],
  );

  useEffect(() => {
    notifier.notify(state.shape);
  }, [state.shape]);

  return {
    state,
    mapRef,
    ...actions,
  };
};
