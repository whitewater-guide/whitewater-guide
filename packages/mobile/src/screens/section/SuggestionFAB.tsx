import { useSection } from '@whitewater-guide/clients';
import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, IconSource } from 'react-native-paper';
import { Icon } from '../../components';
import Screens from '../screen-names';

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

interface Props {
  type?: 'simple' | 'photo';
}

const renderPencil: IconSource = ({ size, color }) => (
  <Icon icon="pencil-plus" size={size} color={color} narrow={true} />
);

export const SuggestionFAB: React.FC<Props> = React.memo(({ type }) => {
  const icon = type === 'photo' ? 'add-a-photo' : renderPencil;
  const { navigate } = useNavigation();
  const { node } = useSection();
  const onPress = useCallback(
    () => navigate(Screens.Suggestion, { sectionId: node!.id, type }),
    [navigate, type, node],
  );
  return <FAB style={styles.fab} icon={icon} onPress={onPress} />;
});

SuggestionFAB.displayName = 'SuggestionFAB';

export default SuggestionFAB;
