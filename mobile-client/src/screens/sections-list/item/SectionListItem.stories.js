import React from 'react';
import { View } from 'react-native';
import { action, storiesOf } from '@kadira/react-native-storybook';
import SectionListItem from './SectionListItem';

const section = {
  _id: 'c6YroqMiJva72LRv4',
  name: 'Waterfall run',
  season: 'Almost all winter',
  seasonNumeric: [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23],
  river: {
    _id: 'ydD5e2Cwge53gjMH3',
    name: 'Castro Laboreiro',
  },
  region: {
    _id: 'DZQrCosGe3Roqqn2u',
  },
  distance: 4,
  drop: 200,
  duration: 20,
  difficulty: 3.5,
  difficultyXtra: 'VI, X',
  rating: 4.5,
  description: 'Description',
  putIn: {
    _id: 'ErhZSBEzw5G3iDfpp',
    coordinates: [
      -8.183466,
      41.951795,
    ],
    altitude: 550,
    description: null,
    kind: 'put-in',
  },
  takeOut: {
    _id: '5nS96oApLPFdDDP2J',
    coordinates: [
      -8.20933,
      41.923466,
    ],
    altitude: 340,
    description: null,
    kind: 'take-out',
  },
  gauge: null,
  levels: {
    minimum: 4,
    maximum: 15,
    optimum: 12,
    impossible: 12,
    approximate: 0,
    lastTimestamp: '2017-04-19T10:30:00.000Z',
    lastValue: 2.393,
  },
  flows: {
    minimum: 4,
    maximum: 15,
    optimum: 12,
    impossible: 17,
    approximate: null,
    lastTimestamp: '2017-04-19T10:30:00.000Z',
    lastValue: 1.3295755,
  },
  media: [
    {
      _id: '5E6vTTJSkaA8JNGj4',
      description: 'Video 1',
      copyright: 'SB Production',
      url: 'https://vimeo.com/59835614',
      type: 'video',
    },
    {
      _id: 'X3NLPfnEsYQeXALKS',
      description: 'Video 2',
      copyright: null,
      url: 'https://www.youtube.com/watch?v=QL4hplZnBkE&feature=youtu.be',
      type: 'video',
    },
  ],
  pois: [
    {
      _id: 'LqJGXCQQ6tdidNAM6',
      name: 'Mirador',
      description: 'Designed wooden platform to look at the waterfalls and take pictures',
      coordinates: [
        -8.201206,
        41.932372,
      ],
      altitude: null,
      kind: 'other',
    },
  ],
  supplyTags: [
    {
      _id: 'rrhaTSyfv4xNTubsK',
      name: 'Rains',
    },
  ],
  kayakingTags: [
    {
      _id: '8WXvEvvcCHYgqPETv',
      name: 'Waterfalls',
    },
    {
      _id: 'QiuDHoTbi6vctboHu',
      name: 'Boulder Garden',
    },
  ],
  hazardsTags: [
    {
      _id: 'R4yAtesRsz4GpgMij',
      name: 'Syphons',
    },
  ],
  miscTags: [],
};

storiesOf('SectionListItem')
  .add('default', () => (
    <View>
      <SectionListItem section={section} onPress={action('press')} />
    </View>
  ));
