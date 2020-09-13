import { NamedNode } from '@whitewater-guide/commons';

import { WithLanguage } from '~/apollo';

export interface TagRaw extends NamedNode, WithLanguage {
  category: string;
}
