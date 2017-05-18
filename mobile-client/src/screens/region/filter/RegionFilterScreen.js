import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { MultiSlider, Screen } from '../../../components';
import { defaultSectionSearchTerms } from '../../../commons/domain';
import { toRomanDifficulty } from '../../../commons/utils/TextUtils';
import { updatesectionSearchTerms } from '../../../core/actions';
import { currentSectionSearchTerms } from '../../../core/selectors';
import ApplyFilterButton from './ApplyFilterButton';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
});

class RegionFilterScreen extends React.Component {

  static propTypes = {
    screenProps: PropTypes.object,
    back: PropTypes.func.isRequired,
    searchTerms: PropTypes.object,
    updatesectionSearchTerms: PropTypes.func,
  };

  static navigationOptions = {
    title: 'Filters',
    headerLeft: null,
    headerRight: (<ApplyFilterButton />),
  };

  constructor(props) {
    super(props);
    this.state = { ...props.searchTerms };
  }

  componentWillUnmount() {
    this.props.updatesectionSearchTerms(this.state);
  }

  onGoBack = () => this.props.back();

  onChangeDifficulty = difficulty => this.setState({ difficulty });

  onReset = () => this.setState({ ...defaultSectionSearchTerms });

  render() {
    const minDiff = toRomanDifficulty(this.state.difficulty[0]);
    const maxDiff = toRomanDifficulty(this.state.difficulty[1]);
    return (
      <Screen style={styles.container}>
        <MultiSlider
          label={`Difficulty: from ${minDiff} to ${maxDiff}`}
          min={1}
          max={6}
          step={0.5}
          values={this.state.difficulty}
          onValuesChange={this.onChangeDifficulty}
        />
        <Button
          full
          onPress={this.onReset}
        >
          <Text>Reset</Text>
        </Button>
      </Screen>
    );
  }

}

export default connect(
  state => ({ searchTerms: currentSectionSearchTerms(state) }),
  { ...NavigationActions, updatesectionSearchTerms },
)(RegionFilterScreen);
