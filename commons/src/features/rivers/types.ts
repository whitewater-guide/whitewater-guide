import { NamedNode, Node, Timestamped } from '../../core';
import { Region } from '../regions';
import { Section } from '../sections';

export interface River extends NamedNode, Timestamped {
  region: Region;
  sections: [Section];
}

export interface RiverInput {
  id: string | null;
  name: string;
  region: Node;
}
