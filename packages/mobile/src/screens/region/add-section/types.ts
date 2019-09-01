import { Coordinate3d } from '@whitewater-guide/commons';

export type Uncoordinate = [
  string | undefined,
  string | undefined,
  string | undefined,
];

export interface Shape {
  shape: [Uncoordinate, Uncoordinate];
}

export type Maybe3d = Coordinate3d | undefined;
