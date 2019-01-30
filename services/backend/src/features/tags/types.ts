import { WithLanguage } from '@apollo';
import { NamedNode } from '@whitewater-guide/commons';

export interface TagRaw extends NamedNode, WithLanguage {
  category: string;
}
