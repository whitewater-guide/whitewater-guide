import { useNavigation } from '@react-navigation/native';
import { useMapSelection } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { Screens } from '~/core/navigation';
import theme from '../../theme';
import { LogbookNavProp } from './types';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.margin.double,
    bottom: theme.margin.double + theme.safeBottom,
  },
});

interface Props {
  navigate: LogbookNavProp['navigate'];
}

export const AddDescentFAB: React.FC<Props> = ({ navigate }) => {
  const onPress = useCallback(() => navigate(Screens.DESCENT_FORM, {}), [
    navigate,
  ]);
  return (
    <FAB
      style={styles.fab}
      icon="plus"
      onPress={onPress}
      testID="add-descent-fab"
    />
  );
};

export default AddDescentFAB;
