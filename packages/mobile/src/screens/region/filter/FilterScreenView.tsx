import {
  stringifySeason,
  toRomanDifficulty,
  useRegion,
  useSectionsFilterOptions,
  useTags,
} from '@whitewater-guide/clients';
import { Duration } from '@whitewater-guide/schema';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';

import Loading from '~/components/Loading';
import MultiSlider from '~/components/multi-slider';
import SwipeableStarRating from '~/components/SwipeableStarRating';
import TernaryChips from '~/components/TernaryChips';
import { getSeasonLocalizer } from '~/i18n';
import theme from '~/theme';

import { FindButton } from './FindButton';
import type { SearchState } from './types';
import { getStateFactory } from './utils';

const DIFFICULTY_RANGE: [number, number] = [0, 6];
const SEASON_RANGE: [number, number] = [0, 23];
const DURATION_RANGE: [number, number] = [Duration.LAPS, Duration.MULTIDAY];

type ChangeListeners = {
  [k in keyof SearchState]?: (v: SearchState[k]) => void;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  safeArea: {
    backgroundColor: theme.colors.primary,
  },
  rating: {
    alignSelf: 'flex-start',
  },
});

const FilterScreenView: React.FC = () => {
  const { t } = useTranslation();
  const region = useRegion();
  const filterOptions = useSectionsFilterOptions();
  const { tags, loading } = useTags();
  const stateFactory = useMemo(() => getStateFactory(tags), [tags]);
  const [state, setState] = useState(stateFactory(filterOptions));

  const onChange: ChangeListeners = useMemo(
    () =>
      [
        'difficulty',
        'duration',
        'seasonNumeric',
        'rating',
        'kayaking',
        'hazards',
        'supply',
        'misc',
      ].reduce(
        (acc, key) => ({
          ...acc,
          [key]: (value: any) => {
            setState((s) => ({ ...s, [key]: value }));
          },
        }),
        {},
      ),
    [setState],
  );

  if (loading) {
    return <Loading />;
  }

  const [minDiff, maxDiff] = state.difficulty.map(toRomanDifficulty);
  const [minDuration, maxDuration] = state.duration.map((d) =>
    t(`durations:${d}`),
  );
  const difficultyLabel: string =
    minDiff === maxDiff
      ? t('filter:difficultyValue', { minDiff })
      : t('filter:difficultyRange', { minDiff, maxDiff });
  const durationLabel: string =
    minDuration === maxDuration
      ? t('filter:durationValue', { minDuration })
      : t('filter:durationRange', { minDuration, maxDuration });

  return (
    <View style={StyleSheet.absoluteFill}>
      <ScrollView contentContainerStyle={styles.container}>
        <MultiSlider
          label={difficultyLabel}
          range={DIFFICULTY_RANGE}
          step={0.5}
          values={state.difficulty}
          onChange={onChange.difficulty}
        />
        <MultiSlider
          label={durationLabel}
          range={DURATION_RANGE}
          step={10}
          values={state.duration}
          onChange={onChange.duration}
        />
        <MultiSlider
          label={`${t('commons:season')}: ${stringifySeason(
            state.seasonNumeric,
            true,
            getSeasonLocalizer(t),
          )}`}
          range={SEASON_RANGE}
          step={1}
          behavior="invert"
          values={state.seasonNumeric}
          onChange={onChange.seasonNumeric}
        />

        <Subheading>{t('filter:rating')}</Subheading>
        <SwipeableStarRating
          value={state.rating}
          onChange={onChange.rating}
          style={styles.rating}
        />

        <Subheading>{t('commons:kayakingTypes')}</Subheading>
        <TernaryChips tags={state.kayaking} onChange={onChange.kayaking} />

        <Subheading>{t('commons:hazards')}</Subheading>
        <TernaryChips tags={state.hazards} onChange={onChange.hazards} />

        <Subheading>{t('commons:supplyTypes')}</Subheading>
        <TernaryChips tags={state.supply} onChange={onChange.supply} />

        <Subheading>{t('commons:miscTags')}</Subheading>
        <TernaryChips tags={state.misc} onChange={onChange.misc} />
      </ScrollView>
      <FindButton searchState={state} regionId={region?.id} />
      <SafeAreaView style={styles.safeArea} />
    </View>
  );
};

export default FilterScreenView;
