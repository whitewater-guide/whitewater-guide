import { stateToMarkdown } from 'draft-js-export-markdown';
import { RegionInput } from '../../../ww-commons';
import { RegionFormInput } from './types';

export default function serializeForm(formData?: RegionFormInput): RegionInput | null {
  if (!formData) {
    return null;
  }
  const { description } = formData;
  const stringDescription = description ?
    stateToMarkdown(description.getCurrentContent()).trim() : null;
  return {
    ...formData,
    description: stringDescription,
  };
}
