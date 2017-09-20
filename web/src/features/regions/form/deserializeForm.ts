import { EditorState } from 'draft-js';
import markdownToDraft from 'draft-js-import-markdown';
import { RegionInput } from '../../../ww-commons';
import { RegionFormInput } from './types';

export default function deserializeForm(formData?: RegionInput): RegionFormInput | null {
  if (!formData) {
    return null;
  }
  const { description } = formData;
  const draftDescription = description ?
    EditorState.createWithContent(markdownToDraft(description)) : null;
  return {
    ...formData,
    description: draftDescription,
  };
}
