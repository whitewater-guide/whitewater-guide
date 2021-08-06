import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

import Icon from '~/components/Icon';
import { Screens } from '~/core/navigation';
import theme from '~/theme';

import { ITEM_HEIGHT } from './constants';
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

const AddNewHeader: React.FC = () => {
  const { t } = useTranslation();
  const { dispatch } = useNavigation();
  const onPress = useCallback(() => {
    dispatch((state) =>
      CommonActions.navigate({
        name: Screens.ADD_SECTION_SCREEN,
        params: { fromDescentFormKey: state.key },
      }),
    );
  }, [dispatch]);
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
};

export default AddNewHeader;
