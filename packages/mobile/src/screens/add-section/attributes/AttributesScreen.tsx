import { useTags } from '@whitewater-guide/clients';
import { Duration, Durations } from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Loading from '~/components/Loading';
import { Screen } from '~/components/Screen';
import ModalPickerField from '~/forms/modal-picker';
import NumericField from '~/forms/NumericField';
import RatingField from '~/forms/RatingField';
import TagsField from '~/forms/TagsField';
import theme from '~/theme';

const DURATIONS: Array<Duration | null> = [null].concat(
  Array.from(Durations.entries()).map(([k]) => k) as any,
);
const keyExtractor = (v: Duration | null) => (v ? v.toString() : 'null');

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  durationItem: {
    width: theme.screenWidth * 0.8,
  },
});

const AttributesScreen = React.memo(() => {
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
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
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
      </KeyboardAwareScrollView>
    </Screen>
  );
});

AttributesScreen.displayName = 'AttributesScreen';

export default AttributesScreen;
