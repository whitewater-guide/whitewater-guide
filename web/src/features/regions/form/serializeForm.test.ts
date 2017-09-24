import { ContentState, EditorState } from 'draft-js';
import serializeForm from './serializeForm';
import { RegionFormInput } from './types';

const input: RegionFormInput = {
  id: null,
  name: 'aa',
  description: null,
  pois: [],
  seasonNumeric: [],
  season: null,
  bounds: null,
  hidden: false,
};

it('should handle undefined input', () => {
  expect(serializeForm(undefined)).toBeNull();
});

it('should serialize empty description', () => {
  expect(serializeForm(input)!.description).toBeNull();
});

it('should transform draft.js into markdown string', () => {
  expect(serializeForm({
    ...input,
    description: EditorState.createWithContent(ContentState.createFromText('foo')),
  })!.description).toBe('foo');
});
