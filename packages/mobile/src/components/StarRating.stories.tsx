import { action } from '@storybook/addon-actions';
// @ts-ignore
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paper } from 'react-native-paper';
import { StarRating } from './StarRating';

storiesOf('StarRating')
  .addDecorator((story: any) => (
    <View style={{ ...StyleSheet.absoluteFillObject, padding: 8, paddingTop: 64, backgroundColor: '#AAA' }}>
      <Paper elevation={2} style={{ alignSelf: 'stretch', margin: 16 }}>
        {story()}
      </Paper>
    </View>
  ))
  .add('Fixed, 0', () => (
    <StarRating value={0} />
  ))
  .add('Fixed, 2.5', () => (
    <StarRating value={2.5} />
  ))
  .add('Fixed, 4', () => (
    <StarRating value={4} />
  ))
  .add('Fixed, 5', () => (
    <StarRating value={5} />
  ))
  .add('Interactive, 0', () => (
    <StarRating value={0} onChange={action('change')} />
  ))
  .add('Interactive, 2.5', () => (
    <StarRating value={2.5} onChange={action('change')} />
  ))
  .add('Interactive, 4', () => (
    <StarRating value={4} onChange={action('change')} />
  ))
  .add('Interactive, 5', () => (
    <StarRating value={5} onChange={action('change')} />
  ));
