import { ContentState, EditorState } from 'draft-js';
import { serializeForm } from './serializeForm';

const input = {
  id: null,
  name: 'aa',
  pois: [],
  description: null,
  seasonNumeric: [],
  season: null,
  bounds: null,
  hidden: false,
};

const inputWithDraft = {
  ...input,
  description: EditorState.createWithContent(ContentState.createFromText('foo')),
};

const serializer = serializeForm(['description']);

it('should handle undefined input', () => {
  expect(serializer(undefined)).toBeNull();
});

it('should serialize empty markdown field', () => {
  expect(serializer(input)!.description).toBeNull();
});

it('should transform draft.js into markdown string', () => {
  expect(serializer(inputWithDraft)!.description).toBe('foo');
});

it('should match snapshot', () => {
  expect(serializer(inputWithDraft)).toMatchSnapshot();
});
