import draftToMarkdown from 'draft-js-export-markdown';
import { RegionInput } from '../../../ww-commons';
import { RegionFormInput } from './types';

export default function serializeForm(formData?: RegionFormInput): RegionInput | null {
  if (!formData) {
    return null;
  }
  const { description } = formData;
  const stringDescription = description ?
    draftToMarkdown(description.getCurrentContent()) : null;
  return {
    ...formData,
    description: stringDescription,
  };
}
