import {
  Connection,
  NamedNode,
  Node,
  NodeRef,
  Timestamped,
} from '../../apollo';
import { Region } from '../regions';
import { Section } from '../sections';

export interface River extends NamedNode, Timestamped {
  region: Region;
  sections: Connection<Section>;
  altNames: string[];
}

export interface RiverInput {
  id: string | null;
  name: string;
  altNames: string[] | null;
  region: NodeRef;
}

export interface RiversFilter {
  search?: string;
  regionId?: string;
}

export const isRiver = (node?: Node | null): node is River =>
  !!node && node.__typename === 'River';
