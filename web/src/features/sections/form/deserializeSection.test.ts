import { EditorState } from 'draft-js';
import deserializeSection from './deserializeSection';

jest.mock('draft-js/lib/generateRandomKey', () => () => 'random_key');

// This is real piece of JSON from test server
const testSection = {
  'id': '2b01742c-d443-11e7-9296-cec278b6b50a',
  'name': 'Gal_riv_1_sec_1',
  'language': 'en',
  'altNames': [],
  'river': {
    'id': 'a8416664-bfe3-11e7-abc4-cec278b6b50a',
    'language': 'en',
    'name': 'Gal_Riv_One',
    'altNames': [],
    '__typename': 'River'
  },
  '__typename': 'Section',
  'season': 'Gal_riv_1_sec_1 season',
  'seasonNumeric': [
    0,
    1,
    2,
    3,
    4
  ],
  'distance': 11.1,
  'drop': 12.2,
  'duration': 20,
  'difficulty': 3.5,
  'difficultyXtra': 'X',
  'rating': 4.5,
  'description': 'Gal\\_riv\\_1\\_sec\\_1 description',
  'shape': [
    [
      10,
      10,
      0
    ],
    [
      20,
      20,
      0
    ]
  ],
  'createdAt': '2018-02-17T10:50:28.960Z',
  'updatedAt': '2018-02-17T12:04:44.108Z',
  'pois': [
    {
      'id': 'ca0bee06-d445-11e7-9296-cec278b6b50a',
      'language': 'en',
      'name': 'Galicia Riv 1 Sec 1 Rapid',
      'description': 'Some rapid',
      'coordinates': [
        1.2,
        3.2,
        4.3
      ],
      'kind': 'rapid',
      '__typename': 'Point'
    },
    {
      'id': 'ef6f80ea-d445-11e7-9296-cec278b6b50a',
      'language': 'en',
      'name': 'Galicia Riv 1 Sec 1 Portage',
      'description': 'Some portage',
      'coordinates': [
        5,
        6,
        7
      ],
      'kind': 'portage',
      '__typename': 'Point'
    }
  ],
  'tags': [
    {
      'id': 'waterfalls',
      'language': 'en',
      'name': 'Waterfalls',
      'category': 'kayaking',
      '__typename': 'Tag'
    },
    {
      'id': 'undercuts',
      'language': 'en',
      'name': 'Undercuts',
      'category': 'hazards',
      '__typename': 'Tag'
    }
  ],
  'gauge': {
    'id': 'aba8c106-aaa0-11e7-abc4-cec278b6b50a',
    'language': 'en',
    'name': 'Galicia gauge 1',
    '__typename': 'Gauge'
  },
  'levels': {
    'minimum': 10,
    'maximum': 30,
    'optimum': 20,
    'impossible': 40,
    'approximate': false,
    '__typename': 'GaugeBinding'
  },
  'flows': {
    'minimum': 10,
    'maximum': 30,
    'optimum': 20,
    'impossible': 40,
    'approximate': false,
    '__typename': 'GaugeBinding'
  },
  'flowsText': 'Gal_riv_1_sec_1 flows text'
};

let formData: object;

beforeEach(() => {
  formData = deserializeSection(testSection);
});

it('should transform description into draft.js state', () => {
  expect(formData).toHaveProperty('description', expect.any(EditorState));
});

it('should split tags into categories', () => {
  expect(formData).toMatchObject({
    kayakingTags: [{ id: 'waterfalls', name: 'Waterfalls' }],
    hazardsTags: [{ id: 'undercuts', name: 'Undercuts' }],
    supplyTags: [],
    miscTags: [],
  });
});

it('should not contain `tags` property', () => {
  expect(formData).not.toHaveProperty('tags');
});

it('should contain __typename', () => {
  expect(JSON.stringify(formData).indexOf('__typename')).toBe(-1);
});

it('should match snapshot', () => {
  expect(formData).toMatchSnapshot();
});
