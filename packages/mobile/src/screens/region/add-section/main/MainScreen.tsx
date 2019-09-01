import { toRomanDifficulty } from '@whitewater-guide/commons';
import times from 'lodash/times';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../../components';
import { ModalPickerField, TextField } from '../../../../components/forms';
import theme from '../../../../theme';
import TabBarLabel from '../TabBarLabel';
import PiToPlaceholder from './PiToPlaceholder';
import RiverPlaceholder from './RiverPlaceholder';

const DIFFICULTIES = [0].concat(times(11, (i) => 1 + i * 0.5));
const keyExtractor = (n: number) => n.toString(10);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: theme.margin.single,
  },
  difficultyRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    flex: 1,
  },
  brackets: {
    color: theme.colors.componentBorder,
    fontSize: 28,
    marginBottom: 22,
    marginHorizontal: theme.margin.half,
  },
});

export const MainScreen: NavigationScreenComponent = React.memo(() => {
  const { t } = useTranslation();
  return (
    <Screen>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <RiverPlaceholder />
        <TextField
          name="name"
          label={t('screens:addSection.main.nameLabel')}
          testID="name"
        />
        <View style={styles.difficultyRow}>
          <View style={styles.box}>
            <ModalPickerField<number>
              label={t('commons:difficulty')}
              name="difficulty"
              valueToString={toRomanDifficulty}
              options={DIFFICULTIES}
              keyExtractor={keyExtractor}
            />
          </View>
          <Text style={styles.brackets}>{'('}</Text>
          <View style={styles.box}>
            <TextField
              name="difficultyXtra"
              autoCapitalize="characters"
              autoCompleteType="off"
              autoCorrect={false}
              maxLength={8}
              testID="difficultyXtra"
              helperText={t('screens:addSection.main.difficultyXtraHelper')}
            />
          </View>
          <Text style={styles.brackets}>{')'}</Text>
        </View>
        <PiToPlaceholder index={0} />
        <PiToPlaceholder index={1} />
      </KeyboardAwareScrollView>
    </Screen>
  );
});

MainScreen.displayName = 'MainScreen';
MainScreen.navigationOptions = {
  tabBarLabel: (props: any) => (
    <TabBarLabel {...props} i18nKey="screens:addSection.tabs.main" />
  ),
};
