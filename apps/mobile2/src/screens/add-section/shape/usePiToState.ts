import type Mapbox from '@rnmapbox/maps';
import type { Coordinate2d } from '@whitewater-guide/clients';
import { ensureAltitude } from '@whitewater-guide/clients';
import type { SectionInput } from '@whitewater-guide/schema';
import round from 'lodash/round';
import type { MutableRefObject } from 'react';
import { useMemo, useReducer, useRef } from 'react';

export interface PiToState {
  shape: [CodegenCoordinates | undefined, CodegenCoordinates | undefined];
  selected: -1 | 0 | 1;
}

export type Shape = Pick<PiToState, 'shape'>;

type Action =
  | { type: 'select'; selected: PiToState['selected'] }
  | { type: 'move'; coordinate: CodegenCoordinates }
  | { type: 'setOne'; index: 0 | 1; coordinate: CodegenCoordinates }
  | { type: 'set'; shape: [CodegenCoordinates, CodegenCoordinates] };

const roundCoord = (coordinate: CodegenCoordinates): CodegenCoordinates =>
  ensureAltitude(coordinate).map((n) => round(n, 4)) as CodegenCoordinates;

const reducer = (state: PiToState, action: Action): PiToState => {
  if (action.type === 'select') {
    return { ...state, selected: action.selected };
  }
  if (action.type === 'move') {
    if (state.selected === -1) {
      return state;
    }
    const shape: PiToState['shape'] = [...state.shape] as PiToState['shape'];
    shape[state.selected] = roundCoord(action.coordinate);
    return { ...state, shape };
  }
  if (action.type === 'setOne') {
    const shape: PiToState['shape'] = [...state.shape] as PiToState['shape'];
    shape[action.index] = roundCoord(action.coordinate);
    return { ...state, shape };
  }
  if (action.type === 'set') {
    return {
      ...state,
      shape: ensureAltitude(action.shape) as PiToState['shape'],
    };
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
  const stateRef = useRef(state);
  stateRef.current = state;

  const actions = useMemo(
    () => ({
      select: (selected: PiToState['selected']) => {
        if (mapRef.current && selected === -1) {
          // Capture the slot before deselect — the async getCenter must not
          // race the synchronous select dispatch (state.selected becomes -1).
          const prev = stateRef.current.selected;
          if (prev !== -1) {
            mapRef.current.getCenter().then((coordinate: Coordinate2d) => {
              dispatch({ type: 'setOne', index: prev, coordinate });
            });
          }
        }
        dispatch({ type: 'select', selected });
      },
      move: (coordinate: CodegenCoordinates) =>
        dispatch({ type: 'move', coordinate }),
      set: (shape: [CodegenCoordinates, CodegenCoordinates]) =>
        dispatch({ type: 'set', shape }),
    }),
    [],
  );

  return {
    state,
    mapRef,
    ...actions,
  };
};
