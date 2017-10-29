import { EditorState } from 'draft-js';
import { deserializeForm } from './deserializeForm';

jest.mock('draft-js/lib/generateRandomKey', () => () => 'random_key');

const region = {
  __typename: 'Region',
  id: 'id',
  language: 'en',
  name: 'foo',
  description: 'bar',
  season: 'season',
  seasonNumeric: [1, 2],
  hidden: false,
  updatedAt: '2017-10-10T10:16:34.629Z',
  createdAt: '2017-10-10T10:16:34.629Z',
  bounds: [[1, 1, 1], [2, 2, 2], [3, 4, 3]],
  source: {
    __typename: 'Source',
    id: 'source_id',
    language: 'en',
    name: 'source_name',
  },
  location: null,
  pois: [
    {
      __typename: 'Point',
      id: 'point_id',
      language: 'en',
      name: 'point_name',
      coordinates: [1, 2, 0],
      description: 'point_description',
      kind: 'take-out',
      updatedAt: '2017-10-10T10:16:34.629Z',
      createdAt: '2017-10-10T10:16:34.629Z',
    },
  ],
  sources: {
    count: 1,
    nodes: [
      {
        __typename: 'Source',
        id: 'source_id',
        language: 'en',
        name: 'source_name',
      },
    ],
  },
};

let result: any;

const deserializer = deserializeForm(['description'], ['pois', 'source', 'location'], ['sources']);

beforeEach(() => {
  result = deserializer(region);
});

it('should handle undefined input', () => {
  expect(deserializer(undefined)).toBeUndefined();
});

it('should handle null input', () => {
  expect(deserializer(undefined)).toBeUndefined();
});

it('should omit __typename', () => {
  expect(result).not.toHaveProperty('__typename');
});

it('should omit language', () => {
  expect(result).not.toHaveProperty('language');
});

it('should convert markdown to draft', () => {
  expect(result.description).toBeInstanceOf(EditorState);
});

it('should omit timestamps', () => {
  expect(result).not.toHaveProperty('createdAt');
  expect(result).not.toHaveProperty('updatedAt');
});

it('should omit __typename from nested object in array', () => {
  expect(result!.pois[0]).not.toHaveProperty('__typename');
});

it('should omit language from nested object in array', () => {
  expect(result!.pois[0]).not.toHaveProperty('language');
});

it('should omit __typename from nested object', () => {
  expect(result!.source).not.toHaveProperty('__typename');
});

it('should omit language from nested object', () => {
  expect(result!.source).not.toHaveProperty('language');
});

it('should keep null nested objects', () => {
  expect(result!.location).toBeNull();
});

it('should omit timestamps from nested object', () => {
  expect(result!.pois[0]).not.toHaveProperty('createdAt');
  expect(result!.pois[0]).not.toHaveProperty('updatedAt');
});

it('should transform connections', () => {
  expect(result.sources).toEqual([{ id: 'source_id', name: 'source_name' }]);
});

it('should transform connections without nodes', () => {
  const { sources, ...rest } = region;
  const input = { ...rest, sources: [] };
  const output: any = deserializer(input);
  expect(output.sources).toEqual([]);
});

it('should match snapshot', () => {
  expect(result).toMatchSnapshot();
});
