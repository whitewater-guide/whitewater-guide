import { Coordinate3d } from '@whitewater-guide/commons';
import { PiToState } from './shape/usePiToState';

export type Shape = Pick<PiToState, 'shape'>;

export type Maybe3d = Coordinate3d | undefined;
