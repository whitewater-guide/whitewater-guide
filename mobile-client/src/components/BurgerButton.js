import React from 'react';
import { Button, Icon } from 'native-base';

export default ({ navigation }) => (
  <Button transparent onPress={() => navigation.navigate('DrawerOpen')} >
    <Icon name="menu" />
  </Button>
);
