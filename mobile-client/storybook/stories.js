import React from 'react';
import { storiesOf } from '@kadira/react-native-storybook';
import { View, Text } from 'react-native';

const style = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF'
};

const CenteredView = (props) => (
  <View style={style}>
    {props.children}
  </View>
);

storiesOf('CenteredView')
  .add('default view', () => (
    <CenteredView>
      <Text>Hello Storybook</Text>
    </CenteredView>
  ));
