import { NamedNode } from '../../core';
import { Group } from '../groups/types';
import { Region } from '../regions';
import { Connection } from '../types';

export interface Group extends NamedNode {
  regions?: Connection<Region>;
}

export interface GroupInput {
  id: string | null;
  name: string;
}

export interface WithGroups {
  groups: Group[];
  groupsLoading: boolean;
}
