import { Section } from '@whitewater-guide/commons';
import flatMap from 'lodash/flatMap';

export function extractPhotos(sections: Section[]): string[] {
  return flatMap(sections, (section) => {
    if (!section.media || !section.media.nodes) {
      return [];
    }
    return section.media.nodes
      .reduce(
        (urls, { kind, image, thumb }) =>
          kind === 'photo' ? [...urls, image!, thumb!] : urls,
        [] as string[],
      )
      .filter((url) => !!url);
  });
}
