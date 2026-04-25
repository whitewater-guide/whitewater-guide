import { useTags } from '@whitewater-guide/clients';
import type { Duration } from '@whitewater-guide/schema';
import { Durations } from '@whitewater-guide/schema';
import groupBy from 'lodash/groupBy';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from 'react-native-keyboard-controller';

import Loading from '../../../components/Loading';
import Screen from '../../../components/Screen';
import CheckboxField from '../../../forms/CheckboxField';
import ModalPickerField from '../../../forms/modal-picker';
import NumericField from '../../../forms/NumericField';
import RatingField from '../../../forms/RatingField';
import TagsField from '../../../forms/TagsField';
import theme from '../../../theme';

const { width: screenWidth } = Dimensions.get('window');

const DURATIONS: Array<Duration | null> = [null, ...Array.from(Durations.keys())];
const keyExtractor = (v: Duration | null) => (v ? v.toString() : 'null');

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  durationItem: {
    width: screenWidth * 0.8,
  },
});

function AttributesScreen() {
  const { t } = useTranslation();
  const durationToString = useCallback(
    (v: Duration | null) => (v ? t(`durations:${v}`) : '-'),
    [t],
  );
  const { tags, loading } = useTags();
  const grouped = useMemo(() => groupBy(tags, 'category'), [tags]);
  if (loading) {
    return (
      <Screen>
        <Loading />
      </Screen>
    );
  }
  return (
    <Screen>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        bottomOffset={35}
      >
        <RatingField name="rating" label={t('commons:rating')} />
        <NumericField
          name="distance"
          label={t('commons:length', { unit: 'km' })}
          keyboardType="numeric"
          testID="distance"
        />
        <NumericField
          name="drop"
          label={t('commons:drop', { unit: 'm' })}
          keyboardType="numeric"
        />
        <ModalPickerField<Duration | null>
          label={t('commons:duration')}
          name="duration"
          valueToString={durationToString}
          options={DURATIONS}
          keyExtractor={keyExtractor}
          itemStyle={styles.durationItem}
        />
        <TagsField
          name="tags"
          options={grouped.kayaking}
          label={t('commons:kayakingTypes')}
        />
        <TagsField
          name="tags"
          options={grouped.hazards}
          label={t('commons:hazards')}
        />
        <TagsField
          name="tags"
          options={grouped.supply}
          label={t('commons:supplyTypes')}
        />
        <TagsField
          name="tags"
          options={grouped.misc}
          label={t('commons:miscTags')}
        />
        <CheckboxField
          name="hidden"
          label={t('screens:addSection.attributes.hidden')}
        />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </Screen>
  );
}

export default AttributesScreen;
