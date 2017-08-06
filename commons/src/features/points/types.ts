import { NamedResource } from '../../core';

export interface Point extends NamedResource {
  description: string | null;
  coordinates: [number, number, number];
  kind: string;
}

export interface PointInput extends NamedResource {
  description: string | null;
  coordinates: [number, number, number];
  kind: string;
  deleted: boolean;
}
