import { NamedNode, Node, Timestamped } from '../../core';
import { Region } from '../regions';
import { Section } from '../sections';

export interface River extends NamedNode, Timestamped {
  region: Region;
  sections: Section[];
  altNames: string[];
}

export interface RiverInput {
  id: string | null;
  name: string;
  altNames: string[] | null;
  region: Node;
}
