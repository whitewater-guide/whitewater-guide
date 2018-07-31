import flatMap from 'lodash/flatMap';
import { Section } from '../../../../ww-commons/features/sections';
import { getThumbUri, getUri } from '../../../media';

export function extractPhotos(sections: Section[]): string[] {
  return flatMap(sections, (section) => {
    if (!section.media || !section.media.nodes) {
      return [];
    }
    return section.media.nodes.reduce(
      (urls, { kind, url }) => kind === 'photo' ? [ ...urls, getUri(url).url, getThumbUri(url).uri ] : urls,
      [] as string[],
    );
  });
}
