import Mapbox from '@react-native-mapbox-gl/maps';
import {
  Coordinate2d,
  Coordinate3d,
  SectionInput,
  withZeroAlt,
} from '@whitewater-guide/commons';
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
  shape: [Coordinate3d | undefined, Coordinate3d | undefined];
  selected: -1 | 0 | 1;
}

type Action =
  | { type: 'select'; selected: PiToState['selected'] }
  | { type: 'move'; coordinate: Coordinate2d }
  | { type: 'set'; shape: [Coordinate3d, Coordinate3d] };

const reducer = (state: PiToState, action: Action): PiToState => {
  if (action.type === 'select') {
    return { ...state, selected: action.selected };
  }
  if (action.type === 'move') {
    if (state.selected === -1) {
      return state;
    }
    const shape: PiToState['shape'] = [...state.shape] as any;
    shape[state.selected] = withZeroAlt(action.coordinate).map((n) =>
      round(n, 4),
    ) as Coordinate3d;
    return { ...state, shape };
  }
  if (action.type === 'set') {
    return { ...state, shape: withZeroAlt(action.shape) as any };
  }
  return state;
};

const initState = (initialShape: SectionInput['shape']): PiToState => {
  return {
    selected: -1,
    shape: [initialShape[0], initialShape[initialShape.length - 1]],
  };
};

interface Hook {
  state: PiToState;
  select: (selected: PiToState['selected']) => void;
  move: (coordinate: Coordinate2d) => void;
  set: (shape: [Coordinate3d, Coordinate3d]) => void;
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
      move: (coordinate: Coordinate2d) =>
        dispatch({ type: 'move', coordinate }),
      set: (shape: [Coordinate3d, Coordinate3d]) =>
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
