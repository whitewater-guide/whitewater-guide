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

const inputWithConnections = {
  ...inputWithDraft,
  sources: [{
    __typename: 'Source',
    id: 'source_id',
    name: 'Source name',
    language: 'en',
  }],
};

const serializer = serializeForm(['description'], ['sources']);

it('should handle undefined input', () => {
  expect(serializer(undefined)).toBeNull();
});

it('should serialize empty markdown field', () => {
  expect(serializer(input)!.description).toBeNull();
});

it('should transform draft.js into markdown string', () => {
  expect(serializer(inputWithDraft)!.description).toBe('foo');
});

it('should strip connections to ids only', () => {
  expect(serializer(inputWithConnections)!.sources).toEqual([{ id: 'source_id' }]);
});

it('should match snapshot', () => {
  expect(serializer(inputWithConnections)).toMatchSnapshot();
});
