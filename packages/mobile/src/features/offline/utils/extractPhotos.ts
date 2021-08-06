import flatMap from 'lodash/flatMap';
import { isPresent } from 'ts-is-present';

import { ListSectionsQuery } from '~/features/offline/offlineSections.generated';

export function extractPhotos(
  sections: ListSectionsQuery['sections']['nodes'],
): string[] {
  return flatMap(sections, (section) => {
    if (!section.media.nodes) {
      return [];
    }
    return section.media.nodes
      .reduce(
        (urls, { kind, image, thumb }) =>
          kind === 'photo' ? [...urls, image, thumb] : urls,
        [] as Array<string | null | undefined>,
      )
      .filter(isPresent);
  });
}
