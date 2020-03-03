import { useSection } from '@whitewater-guide/clients';
import Icon from 'components/Icon';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import Screens from '../screen-names';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const renderPencil = ({ size, color }: any) => (
  <Icon icon="pencil-plus" size={size} color={color} narrow={true} />
);

export const SuggestionFAB: React.FC = React.memo(() => {
  const { navigate } = useNavigation();
  const { node } = useSection();
  const onPress = useCallback(
    () => navigate(Screens.Suggestion, { sectionId: node!.id }),
    [navigate, node],
  );
  return <FAB style={styles.fab} icon={renderPencil} onPress={onPress} />;
});

SuggestionFAB.displayName = 'SuggestionFAB';

export default SuggestionFAB;
