import { Connection, NamedNode } from '../../core';
import { Region } from '../regions';

export interface Group extends NamedNode {
  sku: string | null;
  regions?: Connection<Region>;
}

export interface GroupInput {
  id: string | null;
  name: string;
  sku: string | null;
}
