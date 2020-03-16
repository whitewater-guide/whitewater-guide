import { useNavigation } from '@react-navigation/native';
import { useSection } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import Icon from '~/components/Icon';
import { Screens } from '~/core/navigation';
import { SectionScreenNavProp } from '~/screens/section/types';

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

interface Props {
  testID?: string;
}

export const SuggestionFAB: React.FC<Props> = ({ testID }) => {
  const { navigate } = useNavigation<SectionScreenNavProp>();
  const { node } = useSection();
  const onPress = useCallback(() => {
    navigate(Screens.SUGGESTION, { sectionId: node!.id });
  }, [navigate, node]);
  return (
    <FAB
      style={styles.fab}
      icon={renderPencil}
      onPress={onPress}
      testID={testID}
    />
  );
};

SuggestionFAB.displayName = 'SuggestionFAB';

export default SuggestionFAB;
