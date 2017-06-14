import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Text, Body, Right, Icon } from '../../components';
import theme from '../../theme';

export const REGION_ITEM_HEIGHT = 72;

const styles = StyleSheet.create({
  container: {
    height: REGION_ITEM_HEIGHT,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
  },
  rivers: {
    width: 75,
  }
});

export const RegionListItem = ({ region, onPress }) => {
  return (
    <ListItem style={styles.container} onPress={() => onPress(region)}>
      <Body>
        <Text>{region.name}</Text>
        <View style={styles.row}>
          <Text note style={styles.rivers}>{`Rivers: ${region.riversCount}`}</Text>
          <Text note>{`Sections: ${region.sectionsCount}`}</Text>
        </View>
      </Body>
      <Right>
        <Icon color={theme.colors.componentBorder} icon="arrow-forward" />
      </Right>
    </ListItem>
  );
};
