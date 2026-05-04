import { CommonActions, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

import Icon from '../../../components/Icon';
import { Screens } from '../../../core/navigation';
import theme from '../../../theme';
import { ITEM_HEIGHT } from './constants';
import type { DescentFormSectionScreenProps } from './navigation-types';
import SectionHeader from './SectionHeader';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightBackground,
    padding: theme.margin.single,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

function AddNewHeader() {
  const { t } = useTranslation();
  const navigation =
    useNavigation<DescentFormSectionScreenProps['navigation']>();

  const onPress = useCallback(() => {
    navigation.dispatch((state) =>
      CommonActions.navigate({
        name: Screens.ADD_SECTION_TABS,
        params: { fromDescentFormKey: state.key },
      }),
    );
  }, [navigation]);

  return (
    <>
      <SectionHeader id="New" />
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Icon icon="plus" />
          <Paragraph>
            {t('screens:descentForm.section.createSectionItem')}
          </Paragraph>
        </View>
      </TouchableOpacity>
    </>
  );
}

export default AddNewHeader;
