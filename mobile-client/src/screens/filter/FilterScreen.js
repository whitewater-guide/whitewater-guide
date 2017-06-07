import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';
import { compose, hoistStatics, withProps } from 'recompose';
import { NavigationActions } from 'react-navigation';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { get, memoize } from 'lodash';
import { MultiSlider, Screen, TernaryChips, spinnerWhileLoading } from '../../components';
import { Durations } from '../../commons/domain';
import { tagsToSelections, withTags } from '../../commons/features/tags';
import { updateSearchTerms, searchTermsSelector } from '../../commons/features/regions';
import { toRomanDifficulty } from '../../commons/utils/TextUtils';
import stringifySeason from '../../commons/utils/stringifySeason';
import ResetFilterButton from './ResetFilterButton';

const DIFFICULTY_RANGE = [1,6];
const SEASON_RANGE=[0,23];
const DURATION_RANGE = [Durations[0].value, Durations[Durations.length - 1].value];

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  starWrapper: {
    paddingBottom: 16,
  },
});

class FilterScreen extends React.Component {

  static propTypes = {
    searchTerms: PropTypes.object,
    updateSearchTerms: PropTypes.func.isRequired,
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
      <Screen style={styles.container}>
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
        <View style={styles.starWrapper}>
          <Text>Rating</Text>
          <StarRating
            rating={this.state.rating}
            starSize={20}
            starColor={'#a7a7a7'}
            selectedStar={this.onChange('rating')}
          />
        </View>
        <Text>Kayaking types</Text>
        <TernaryChips values={this.state.kayakingTags} onChange={this.onChange('kayakingTags')} />
        <Text>Hazards</Text>
        <TernaryChips values={this.state.hazardsTags} onChange={this.onChange('hazardsTags')} />
        <Text>Supply types</Text>
        <TernaryChips values={this.state.supplyTags} onChange={this.onChange('supplyTags')} />
        <Text>Misc tags</Text>
        <TernaryChips values={this.state.miscTags} onChange={this.onChange('miscTags')} />
        <Button full onPress={this.onApply} >
          <Text>Search</Text>
        </Button>
      </Screen>
    );
  }

}

const container = compose(
  withTags(),
  spinnerWhileLoading(props => props.tagsLoading),
  withProps(props => ({ regionId: get(props, 'navigation.state.params.regionId') })),
  connect(
    searchTermsSelector,
    { ...NavigationActions, updateSearchTerms },
  ),
);

export default hoistStatics(container)(FilterScreen);

