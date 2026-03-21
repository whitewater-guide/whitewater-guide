import flatMap from 'lodash/flatMap';
import type { DeepPartial, ValuesType } from 'utility-types';

import type { ListSectionsQuery } from '~/features/offline/offlineSections.generated';

type ListedSection = ValuesType<ListSectionsQuery['sections']['nodes']>;

export function extractPhotos(
  sections: Array<DeepPartial<ListedSection>>,
): string[] {
  return flatMap(sections, (section) => {
    if (!section.media?.nodes) {
      return [];
    }
    return section.media.nodes
      .reduce(
        (urls, { kind, image, thumb }) =>
          kind === 'photo' ? [...urls, image, thumb] : urls,
        [] as Array<string | null | undefined>,
      )
      .filter((p): p is string => !!p);
  });
}
