import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { get, capitalize, trim } from 'lodash';
import { SectionPropType } from '../../../commons/features/sections';
import { durationToString } from '../../../commons/domain';
import stringifySeason from '../../../commons/utils/stringifySeason';
import { Button, DifficultyThumb, StarRating, ListItem, Left, Body, Right, Text } from '../../../components';
import SelectedElementView from '../../../components/map/SelectedElementView';
import theme from '../../../theme';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
});

class SelectedSectionView extends React.PureComponent {

  static propTypes = {
    selectedSection: SectionPropType,
    driver: PropTypes.object,
    onLayout: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    measured: PropTypes.bool,
  };

  static defaultProps = {
    measured: false,
  };

  detailsHandler = () => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: this.props.selectedSection._id },
    }));
  };

  renderHeader = () => {
    const { selectedSection: section } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.body}>
          <Text numberOfLines={1}>{get(section, 'river.name', '_')}</Text>
          <Text numberOfLines={1}>{get(section, 'name', '_')}</Text>
          <View style={styles.starsContainer}>
            <StarRating value={get(section, 'rating', 0)} />
          </View>
        </View>
        <DifficultyThumb
          difficulty={get(section, 'difficulty', 1)}
          difficultyXtra={get(section, 'difficultyXtra', '_')}
          noBorder
        />
      </View>
    );
  };

  render() {
    const { selectedSection: section } = this.props;
    const buttons = [
      { label: 'Put-in', coordinates: get(section, 'putIn.coordinates', [0, 0]) },
      { label: 'Take-out', coordinates: get(section, 'takeOut.coordinates', [0, 0]) },
    ];
    let season = ' \n ';
    if (section) {
      season = [
        capitalize(trim(stringifySeason(section.seasonNumeric))),
        trim(section.season),
      ].join('\n');
    }
    const duration = section ? durationToString(section.duration) : ' ';
    return (
      <SelectedElementView
        header={this.renderHeader()}
        buttons={buttons}
        selected={!!section}
        {...this.props}
      >
        <View>
          <ListItem>
            <Left><Text>Drop</Text></Left>
            <Right><Text note right>{get(section, 'drop', ' ')}</Text></Right>
          </ListItem>
          <ListItem>
            <Left><Text>Length, km</Text></Left>
            <Right><Text note right>{get(section, 'distance', 0)}</Text></Right>
          </ListItem>
          <ListItem>
            <Left><Text>Duration</Text></Left>
            <Right><Text note right>{duration}</Text></Right>
          </ListItem>
          <ListItem>
            <Left><Text>Season</Text></Left>
            <Body>
              <Text note right numberOfLines={2}>
                {season}
              </Text>
            </Body>
          </ListItem>
        </View>
        <Button primary label="Details" onPress={this.detailsHandler} />
      </SelectedElementView>
    );
  }

}

export default connect()(SelectedSectionView);
