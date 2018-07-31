import { WithLanguage } from '@apollo';
import { NamedNode } from '@ww-commons';

export interface TagRaw extends NamedNode, WithLanguage {
  category: string;
}
