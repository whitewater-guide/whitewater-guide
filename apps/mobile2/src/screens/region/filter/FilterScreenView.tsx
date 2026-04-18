import {
  stringifySeason,
  toRomanDifficulty,
  useSectionsFilterOptions,
  useTags,
} from '@whitewater-guide/clients';
import { Duration } from '@whitewater-guide/schema';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TernaryChips } from '../../../components/Chips';
import Loading from '../../../components/Loading';
import MultiSlider from '../../../components/multi-slider';
import { SwipeableStarRating } from '../../../components/star-rating';
import { getSeasonLocalizer } from '../../../i18n';
import theme from '../../../theme';
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
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  bottomBar: {
    backgroundColor: theme.colors.primary,
  },
  rating: {
    alignSelf: 'flex-start',
  },
});

function FilterScreenView() {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const filterOptions = useSectionsFilterOptions();
  const { tags, loading } = useTags();
  const stateFactory = useMemo(() => getStateFactory(tags), [tags]);
  const [state, setState] = useState(stateFactory(filterOptions));

  const onChange: ChangeListeners = useMemo(
    () =>
      (
        [
          'difficulty',
          'duration',
          'seasonNumeric',
          'rating',
          'kayaking',
          'hazards',
          'supply',
          'misc',
        ] as const
      ).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (value: SearchState[typeof key]) => {
            setState((s) => ({ ...s, [key]: value }));
          },
        }),
        {},
      ),
    [],
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
    <View style={styles.screen}>
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

        <Text variant="titleSmall">{t('filter:rating')}</Text>
        <SwipeableStarRating
          value={state.rating}
          onChange={onChange.rating}
          style={styles.rating}
        />

        <Text variant="titleSmall">{t('commons:kayakingTypes')}</Text>
        <TernaryChips tags={state.kayaking} onChange={onChange.kayaking} />

        <Text variant="titleSmall">{t('commons:hazards')}</Text>
        <TernaryChips tags={state.hazards} onChange={onChange.hazards} />

        <Text variant="titleSmall">{t('commons:supplyTypes')}</Text>
        <TernaryChips tags={state.supply} onChange={onChange.supply} />

        <Text variant="titleSmall">{t('commons:miscTags')}</Text>
        <TernaryChips tags={state.misc} onChange={onChange.misc} />
      </ScrollView>
      <View style={[styles.bottomBar, { paddingBottom: bottom }]}>
        <FindButton searchState={state} />
      </View>
    </View>
  );
}

export default FilterScreenView;
