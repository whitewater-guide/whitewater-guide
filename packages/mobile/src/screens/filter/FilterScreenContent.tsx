import { stringifySeason, toRomanDifficulty } from '@whitewater-guide/clients';
import {
  DefaultSectionSearchTerms,
  Duration,
  SectionSearchTerms,
  SelectableTag,
  Tag,
  TagSelection,
} from '@whitewater-guide/commons';
import groupBy from 'lodash/groupBy';
import memoize from 'lodash/memoize';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { Omit } from 'type-zoo';
import { MultiSlider, StarRating, TernaryChips } from '../../components';
import { getSeasonLocalizer } from '../../i18n';
import theme from '../../theme';
import { FindButton } from './FindButton';
import { InnerProps } from './types';

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

interface State extends Omit<SectionSearchTerms, 'withTags' | 'withoutTags'> {
  kayaking: SelectableTag[];
  hazards: SelectableTag[];
  supply: SelectableTag[];
  misc: SelectableTag[];
}

const propsToState = (props: InnerProps): State => {
  const { tags, searchTerms } = props;
  const { withTags, withoutTags, ...restTerms } =
    searchTerms || DefaultSectionSearchTerms;
  const selectableTags: SelectableTag[] = tags.map((tag: Tag) => {
    const selection = withTags.includes(tag.id)
      ? TagSelection.SELECTED
      : withoutTags.includes(tag.id)
      ? TagSelection.DESELECTED
      : TagSelection.NONE;
    return { ...tag, selection };
  });
  const { kayaking, hazards, supply, misc } = groupBy(
    selectableTags,
    'category',
  );
  return {
    ...restTerms,
    kayaking,
    hazards,
    supply,
    misc,
  };
};

type Acc = Pick<SectionSearchTerms, 'withTags' | 'withoutTags'>;

const stateToSearchTerms = (state: State): SectionSearchTerms => {
  const { kayaking, hazards, supply, misc, ...restTerms } = state;
  const allTags = [...kayaking, ...hazards, ...supply, ...misc];
  const tagIds: Acc = allTags.reduce(
    (acc: Acc, tag) => {
      if (tag.selection === TagSelection.SELECTED) {
        acc.withTags.push(tag.id);
      } else if (tag.selection === TagSelection.DESELECTED) {
        acc.withoutTags.push(tag.id);
      }
      return acc;
    },
    { withTags: [], withoutTags: [] },
  );
  return { ...restTerms, ...tagIds };
};

export default class FilterScreenContent extends React.PureComponent<
  InnerProps,
  State
> {
  readonly state: State = propsToState(this.props);

  onChange: any = memoize((key: keyof State) => (value: any) =>
    this.setState({ [key]: value } as any),
  );

  onApply = (terms: SectionSearchTerms) => {
    this.props.setSearchTerms(terms);
    this.props.navigation.goBack();
  };

  render() {
    const { t } = this.props;
    const { duration, difficulty } = this.state;
    const [minDiff, maxDiff] = difficulty.map(toRomanDifficulty);
    const [minDuration, maxDuration] = duration.map(
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
            values={this.state.difficulty}
            onChange={this.onChange('difficulty')}
          />
          <MultiSlider
            defaultTrackWidth={DEFAULT_SLIDER_WIDTH}
            defaultTrackPageX={DEFAULT_SLIDER_PAGEX}
            label={durationLabel}
            range={DURATION_RANGE}
            step={10}
            values={this.state.duration}
            onChange={this.onChange('duration')}
          />
          <MultiSlider
            defaultTrackWidth={DEFAULT_SLIDER_WIDTH}
            defaultTrackPageX={DEFAULT_SLIDER_PAGEX}
            label={`${t('commons:season')}: ${stringifySeason(
              this.state.seasonNumeric,
              true,
              getSeasonLocalizer(t),
            )}`}
            range={SEASON_RANGE}
            step={1}
            behavior="invert"
            values={this.state.seasonNumeric}
            onChange={this.onChange('seasonNumeric')}
          />

          <Subheading>{t('filter:rating')}</Subheading>
          <StarRating
            value={this.state.rating}
            onChange={this.onChange('rating')}
          />

          <Subheading>{t('commons:kayakingTypes')}</Subheading>
          <TernaryChips
            tags={this.state.kayaking}
            onChange={this.onChange('kayaking')}
          />

          <Subheading>{t('commons:hazards')}</Subheading>
          <TernaryChips
            tags={this.state.hazards}
            onChange={this.onChange('hazards')}
          />

          <Subheading>{t('commons:supplyTypes')}</Subheading>
          <TernaryChips
            tags={this.state.supply}
            onChange={this.onChange('supply')}
          />

          <Subheading>{t('commons:miscTags')}</Subheading>
          <TernaryChips
            tags={this.state.misc}
            onChange={this.onChange('misc')}
          />
        </ScrollView>
        <FindButton
          onApply={this.onApply}
          terms={stateToSearchTerms(this.state)}
        />
        <SafeAreaView style={styles.safeArea} />
      </View>
    );
  }
}
