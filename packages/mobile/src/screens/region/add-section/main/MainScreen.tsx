import { toRomanDifficulty } from '@whitewater-guide/commons';
import times from 'lodash/times';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CCNote from '~/components/CCNote';
import { Screen } from '~/components/Screen';
import { Screens } from '~/core/navigation';
import ModalPickerField from '~/forms/modal-picker';
import TextField from '~/forms/TextField';
import { AddSectionMainNavProps } from '~/screens/region/add-section/main/types';
import theme from '../../../../theme';
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
  ccNote: {
    marginBottom: 24,
  },
});

const MainScreen: React.FC<AddSectionMainNavProps> = React.memo(
  ({ navigation }) => {
    const { t } = useTranslation();

    const onPitoPress = React.useCallback(() => {
      navigation.navigate(Screens.ADD_SECTION_SHAPE);
    }, [navigation.navigate]);

    const onRiverPress = React.useCallback(() => {
      navigation.navigate(Screens.ADD_SECTION_RIVER);
    }, [navigation.navigate]);

    return (
      <Screen>
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          extraHeight={100}
        >
          <RiverPlaceholder onPress={onRiverPress} />
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
          <PiToPlaceholder index={0} onPress={onPitoPress} />
          <PiToPlaceholder index={1} onPress={onPitoPress} />
          <CCNote style={styles.ccNote} />
        </KeyboardAwareScrollView>
      </Screen>
    );
  },
);

MainScreen.displayName = 'MainScreen';

export default MainScreen;
