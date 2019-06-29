import {
  stringifySeason,
  useFilterState,
  useTags,
} from '@whitewater-guide/clients';
import { Duration, toRomanDifficulty } from '@whitewater-guide/commons';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import {
  Loading,
  MultiSlider,
  StarRating,
  TernaryChips,
} from '../../components';
import { getSeasonLocalizer } from '../../i18n';
import theme from '../../theme';
import { FindButton } from './FindButton';
import { NavParams } from './types';
import { getStateFactory } from './utils';

const DIFFICULTY_RANGE: [number, number] = [1, 6];
const SEASON_RANGE: [number, number] = [0, 23];
const DURATION_RANGE: [number, number] = [Duration.LAPS, Duration.MULTIDAY];
// container.paddingHorizontal (12) + multidlider.marginHorizontal (-10) + rangeslider._trackMarginH (18)
const DEFAULT_SLIDER_PAGEX = 20;
const DEFAULT_SLIDER_WIDTH = theme.screenWidth - 2 * DEFAULT_SLIDER_PAGEX;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
  safeArea: {
    backgroundColor: theme.colors.primary,
  },
});

const FilterScreenView: React.FC<NavParams> = ({ regionId }) => {
  const { t } = useTranslation();
  const searchTerms = useFilterState();
  const { tags, loading } = useTags();
  const stateFactory = useMemo(() => getStateFactory(tags), [tags]);
  const [state, setState] = useState(stateFactory(searchTerms));
  const onChange: any = useMemo(() => {
    return Object.keys(state).reduce(
      (acc, key) => ({
        ...acc,
        [key]: (value: any) => setState({ ...state, [key]: value }),
      }),
      {},
    );
  }, [state, setState]);
  if (loading) {
    return <Loading />;
  }
  const [minDiff, maxDiff] = state.difficulty.map(toRomanDifficulty);
  const [minDuration, maxDuration] = state.duration.map(
    (d) => t(`durations:${d}`) as string,
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
          defaultTrackWidth={DEFAULT_SLIDER_WIDTH}
          defaultTrackPageX={DEFAULT_SLIDER_PAGEX}
          label={difficultyLabel}
          range={DIFFICULTY_RANGE}
          step={0.5}
          values={state.difficulty}
          onChange={onChange.difficulty}
        />
        <MultiSlider
          defaultTrackWidth={DEFAULT_SLIDER_WIDTH}
          defaultTrackPageX={DEFAULT_SLIDER_PAGEX}
          label={durationLabel}
          range={DURATION_RANGE}
          step={10}
          values={state.duration}
          onChange={onChange.duration}
        />
        <MultiSlider
          defaultTrackWidth={DEFAULT_SLIDER_WIDTH}
          defaultTrackPageX={DEFAULT_SLIDER_PAGEX}
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
        <StarRating value={state.rating} onChange={onChange.rating} />

        <Subheading>{t('commons:kayakingTypes')}</Subheading>
        <TernaryChips tags={state.kayaking} onChange={onChange.kayaking} />

        <Subheading>{t('commons:hazards')}</Subheading>
        <TernaryChips tags={state.hazards} onChange={onChange.hazards} />

        <Subheading>{t('commons:supplyTypes')}</Subheading>
        <TernaryChips tags={state.supply} onChange={onChange.supply} />

        <Subheading>{t('commons:miscTags')}</Subheading>
        <TernaryChips tags={state.misc} onChange={onChange.misc} />
      </ScrollView>
      <FindButton searchState={state} regionId={regionId} />
      <SafeAreaView style={styles.safeArea} />
    </View>
  );
};

export default FilterScreenView;
