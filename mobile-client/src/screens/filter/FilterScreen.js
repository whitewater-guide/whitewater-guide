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
    title: 'Filters',
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

  render() {
    const minDiff = toRomanDifficulty(this.state.difficulty[0]);
    const maxDiff = toRomanDifficulty(this.state.difficulty[1]);
    const minDuration = Durations.find(({ value }) => value === this.state.duration[0]).slug;
    const maxDuration = Durations.find(({ value }) => value === this.state.duration[1]).slug;
    const difficultyLabel = minDiff === maxDiff ?
      `Difficulty: ${minDiff}` :
      `Difficulty: from ${minDiff} to ${maxDiff}`;
    const durationLabel = minDuration === maxDuration ?
      `Duration: ${minDuration}` :
      `Duration: from ${minDuration} to ${maxDuration}`;
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
            label={`Season: ${stringifySeason(this.state.seasonNumeric, true)}`}
            range={SEASON_RANGE}
            step={1}
            behavior="invert"
            values={this.state.seasonNumeric}
            onChange={this.onChange('seasonNumeric')}
          />
          <Text>Minimal rating</Text>
          <StarRating value={this.state.rating} onChange={this.onChange('rating')} />
          <Text>Kayaking types</Text>
          <TernaryChips values={this.state.kayakingTags} onChange={this.onChange('kayakingTags')} />
          <Text>Hazards</Text>
          <TernaryChips values={this.state.hazardsTags} onChange={this.onChange('hazardsTags')} />
          <Text>Supply types</Text>
          <TernaryChips values={this.state.supplyTags} onChange={this.onChange('supplyTags')} />
          <Text>Misc tags</Text>
          <TernaryChips values={this.state.miscTags} onChange={this.onChange('miscTags')} />
        </ScrollView>
        <Button primary fullWidth onPress={this.onApply} label="Search" />
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
    { ...NavigationActions, updateSearchTerms, selectSection },
  ),
);

export default hoistStatics(container)(FilterScreen);

