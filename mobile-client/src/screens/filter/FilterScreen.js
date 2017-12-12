import PropTypes from 'prop-types';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { compose, hoistStatics, withProps } from 'recompose';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { get, memoize } from 'lodash';
import { Button, MultiSlider, StarRating, TernaryChips, Text, spinnerWhileLoading } from '../../components';
import { Durations } from '../../commons/domain';
import { tagsToSelections, withTags } from '../../commons/features/tags';
import { updateSearchTerms, searchTermsSelector, selectSection } from '../../commons/features/regions';
import { toRomanDifficulty } from '../../commons/utils/TextUtils';
import stringifySeason from '../../commons/utils/stringifySeason';
import ResetFilterButton from './ResetFilterButton';
import I18n from '../../i18n';

const DIFFICULTY_RANGE = [1,6];
const SEASON_RANGE = [0,23];
const DURATION_RANGE = [Durations[0].value, Durations[Durations.length - 1].value];

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
  },
});

const extractTagLabel = v => v.translation;

class FilterScreen extends React.Component {

  static propTypes = {
    searchTerms: PropTypes.object,
    updateSearchTerms: PropTypes.func.isRequired,
    selectSection: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    kayakingTags: PropTypes.array.isRequired,
    hazardsTags: PropTypes.array.isRequired,
    miscTags: PropTypes.array.isRequired,
    supplyTags: PropTypes.array.isRequired,
    regionId: PropTypes.string,
  };

  static navigationOptions = ({ navigation }) => ({
    title: I18n.t('filter.title'),
    headerRight: (<ResetFilterButton regionId={navigation.state.params.regionId} />),
  });

  constructor(props) {
    super(props);
    this.state = {
      ...tagsToSelections(props),
      ...props.searchTerms,
    };
  }

  componentWillMount() {
    // Hide selected element view
    this.props.selectSection(this.props.regionId, null);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchTerms !== nextProps.searchTerms) {
      this.setState({
        ...tagsToSelections(nextProps),
        ...nextProps.searchTerms,
      });
    }
  }

  componentWillUnmount() {
    this.props.updateSearchTerms(this.props.regionId, this.state);
  }

  onChange = memoize(key => value => this.setState({ [key]: value }));

  onApply = () => {
    this.props.back();
  };

  translateTags = (tags, group) =>
    tags.map(tag => ({
      ...tag,
      translation: I18n.t(`${group}.${tag.name}`),
    }));

  render() {
    const minDiff = toRomanDifficulty(this.state.difficulty[0]);
    const maxDiff = toRomanDifficulty(this.state.difficulty[1]);
    const minDurationSlug = Durations.find(({ value }) => value === this.state.duration[0]).slug;
    const maxDurationSlug = Durations.find(({ value }) => value === this.state.duration[1]).slug;
    const minDuration = I18n.t(`durations.${minDurationSlug}`);
    const maxDuration = I18n.t(`durations.${maxDurationSlug}`);
    const difficultyLabel = minDiff === maxDiff ?
      I18n.t('filter.difficultyValue', { minDiff }) :
      I18n.t('filter.difficultyRange', { minDiff, maxDiff });
    const durationLabel = minDuration === maxDuration ?
      I18n.t('filter.durationValue', { minDuration }) :
      I18n.t('filter.durationRange', { minDuration, maxDuration });
    return (
      <View style={StyleSheet.absoluteFill}>
        <ScrollView contentContainerStyle={styles.container}>
          <MultiSlider
            label={difficultyLabel}
            range={DIFFICULTY_RANGE}
            step={0.5}
            values={this.state.difficulty}
            onChange={this.onChange('difficulty')}
          />
          <MultiSlider
            label={durationLabel}
            range={DURATION_RANGE}
            step={10}
            values={this.state.duration}
            onChange={this.onChange('duration')}
          />
          <MultiSlider
            label={`${I18n.t('commons.season')}: ${stringifySeason(this.state.seasonNumeric, true, I18n.t('locale'))}`}
            range={SEASON_RANGE}
            step={1}
            behavior="invert"
            values={this.state.seasonNumeric}
            onChange={this.onChange('seasonNumeric')}
          />
          <Text>{I18n.t('filter.rating')}</Text>
          <StarRating value={this.state.rating} onChange={this.onChange('rating')} />
          <Text>{I18n.t('commons.kayakingTypes')}</Text>
          <TernaryChips
            values={this.translateTags(this.state.kayakingTags, 'kayakingTypes')}
            extractLabel={extractTagLabel}
            onChange={this.onChange('kayakingTags')}
          />
          <Text>{I18n.t('commons.hazards')}</Text>
          <TernaryChips
            values={this.translateTags(this.state.hazardsTags, 'hazards')}
            extractLabel={extractTagLabel}
            onChange={this.onChange('hazardsTags')}
          />
          <Text>{I18n.t('commons.supplyTypes')}</Text>
          <TernaryChips
            values={this.translateTags(this.state.supplyTags, 'supply')}
            extractLabel={extractTagLabel}
            onChange={this.onChange('supplyTags')}
          />
          <Text>{I18n.t('commons.miscTags')}</Text>
          <TernaryChips
            values={this.translateTags(this.state.miscTags, 'miscTags')}
            extractLabel={extractTagLabel}
            onChange={this.onChange('miscTags')}
          />
        </ScrollView>
        <Button primary fullWidth onPress={this.onApply} label={I18n.t('filter.search')} />
      </View>
    );
  }

}

const container = compose(
  withTags(),
  spinnerWhileLoading(props => props.tagsLoading),
  withProps(props => ({ regionId: get(props, 'navigation.state.params.regionId') })),
  connect(
    searchTermsSelector,
    { back: NavigationActions.back, updateSearchTerms, selectSection },
  ),
);

export default hoistStatics(container)(FilterScreen);

