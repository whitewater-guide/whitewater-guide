import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';
import { compose, hoistStatics } from 'recompose';
import { NavigationActions } from 'react-navigation';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { mapValues, pick, memoize } from 'lodash';
import { map } from 'lodash/fp';
import { MultiSlider, Screen, TernaryChips, spinnerWhileLoading } from '../../components';
import { defaultSectionSearchTerms, Durations } from '../../commons/domain';
import { withTags } from '../../commons/features/tags';
import { toRomanDifficulty } from '../../commons/utils/TextUtils';
import stringifySeason from '../../commons/utils/stringifySeason';
import { updatesectionSearchTerms } from '../../core/actions';
import { currentSectionSearchTerms } from '../../core/selectors';
import ApplyFilterButton from './ApplyFilterButton';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  starWrapper: {
    paddingBottom: 16,
  },
});

class FilterScreen extends React.Component {

  static propTypes = {
    screenProps: PropTypes.object,
    back: PropTypes.func.isRequired,
    searchTerms: PropTypes.object,
    updatesectionSearchTerms: PropTypes.func,
    kayakingTags: PropTypes.array.isRequired,
    hazardsTags: PropTypes.array.isRequired,
    miscTags: PropTypes.array.isRequired,
    supplyTags: PropTypes.array.isRequired,
  };

  static navigationOptions = {
    title: 'Filters',
    headerLeft: null,
    headerRight: (<ApplyFilterButton />),
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.mapTags(),
      ...props.searchTerms,
    };
  }

  componentWillUnmount() {
    this.props.updatesectionSearchTerms(this.state);
  }

  onGoBack = () => this.props.back();

  onChange = memoize(key => value => this.setState({ [key]: value }));

  onReset = () => this.setState({ ...this.mapTags(), ...defaultSectionSearchTerms });

  mapTags = () => mapValues(
    pick(this.props, ['kayakingTags', 'hazardsTags', 'miscTags', 'supplyTags']),
    map(tag => ({ ...tag, selection: 'none' })),
  );

  render() {
    const minDiff = toRomanDifficulty(this.state.difficulty[0]);
    const maxDiff = toRomanDifficulty(this.state.difficulty[1]);
    const minDuration = Durations.find(({ value }) => value === this.state.duration[0]).slug;
    const maxDuration = Durations.find(({ value }) => value === this.state.duration[1]).slug;
    return (
      <Screen style={styles.container}>
        <MultiSlider
          label={`Difficulty: from ${minDiff} to ${maxDiff}`}
          min={1}
          max={6}
          step={0.5}
          values={this.state.difficulty}
          onValuesChange={this.onChange('difficulty')}
        />
        <MultiSlider
          label={`Duration: from ${minDuration} to ${maxDuration}`}
          min={Durations[0].value}
          max={Durations[Durations.length - 1].value}
          step={10}
          values={this.state.duration}
          onValuesChange={this.onChange('duration')}
        />
        <MultiSlider
          label={`Season: ${stringifySeason(this.state.seasonNumeric, true)}`}
          min={0}
          max={23}
          step={1}
          values={this.state.seasonNumeric}
          onValuesChange={this.onChange('seasonNumeric')}
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
        <Button full onPress={this.onReset} >
          <Text>Reset</Text>
        </Button>
      </Screen>
    );
  }

}

const container = compose(
  withTags,
  spinnerWhileLoading(props => props.tagsLoading),
  connect(
    state => ({ searchTerms: currentSectionSearchTerms(state) }),
    { ...NavigationActions, updatesectionSearchTerms },
  ),
);

export default hoistStatics(container)(FilterScreen);

