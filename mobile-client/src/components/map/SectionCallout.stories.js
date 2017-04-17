import React from 'react';
import { StyleSheet, View } from 'react-native';
import { storiesOf } from '@kadira/react-native-storybook';
import SectionCallout from './SectionCallout';

const sampleSection = {
  _id: 'FMF9JBAG2edrzLwiQ',
  name: 'Classic',
  season: 'October-May',
  seasonNumeric: [0, 1, 2, 3, 4, 5, 6, 7, 8, 18, 19, 20, 21, 22, 23],
  river: {
    _id: 'S3qqokLZpv7795qkK',
    name: 'Oitaven',
  },
  region: {
    _id: 'DZQrCosGe3Roqqn2u',
  },
  putIn: {
    coordinates: [10,20],
  },
  takeOut: {
    coordinates: [10,20],
  },
  distance: 6,
  drop: 12,
  duration: 1,
  difficulty: 4.5,
  difficultyXtra: 'X',
  rating: 5,
  description: 'Description',
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFDDFF',
    borderColor: 'black',
    borderWidth: 1,
  },
});

storiesOf('SectionCallout')
  .add('default', () => (
    <View style={styles.wrapper}>
      <SectionCallout section={sampleSection} />
    </View>
  ));
