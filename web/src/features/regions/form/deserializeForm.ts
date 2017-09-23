import { EditorState } from 'draft-js';
import { stateFromMarkdown } from 'draft-js-import-markdown';
import { RegionDetails } from '../../../ww-commons/features/regions/types';
import { RegionFormInput } from './types';

export default function deserializeForm(withRegion?: RegionDetails | null): RegionFormInput | undefined {
  if (!withRegion) {
    return undefined;
  }
  const {
    __typename,
    description,
    hidden,
    createdAt,
    updatedAt,
    ...regionInput,
  } = withRegion;
  const draftDescription = description ? EditorState.createWithContent(stateFromMarkdown(description)) : null;
  return {
    ...regionInput,
    hidden: hidden as boolean,
    description: draftDescription,
  };
}
