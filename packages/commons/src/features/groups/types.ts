import { NamedNode } from '../../core';
import { Region } from '../regions';
import { Connection } from '../types';

export interface Group extends NamedNode {
  sku: string | null;
  regions?: Connection<Region>;
}

export interface GroupInput {
  id: string | null;
  name: string;
  sku: string | null;
}
