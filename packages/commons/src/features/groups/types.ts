import { NamedNode } from '../../core';
import { Region } from '../regions';
import { Connection } from '../types';

export interface Group extends NamedNode {
  regions?: Connection<Region>;
}

export interface GroupInput {
  id: string | null;
  name: string;
}
