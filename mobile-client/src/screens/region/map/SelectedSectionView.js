import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { List, ListItem, Left, Right, Text } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { get, capitalize, trim } from 'lodash';
import { SectionPropType } from '../../../commons/features/sections';
import stringifySeason from '../../../commons/utils/stringifySeason';
import { Button, DifficultyThumb, StarRating } from '../../../components';
import SelectedElementView from '../../../components/map/SelectedElementView';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
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
          <Text>{get(section, 'river.name', '_')}</Text>
          <Text>{get(section, 'name', '_')}</Text>
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
    const season = section ? capitalize(trim(`${stringifySeason(section.seasonNumeric)}\n${section.season}`)) : ' \n ';
    return (
      <SelectedElementView
        header={this.renderHeader()}
        buttons={buttons}
        selected={!!section}
        panelHeight={340}
        {...this.props}
      >
        <List>
          <ListItem>
            <Left><Text>Drop</Text></Left>
            <Right><Text note>{get(section, 'drop', ' ')}</Text></Right>
          </ListItem>
          <ListItem>
            <Left><Text>Length, km</Text></Left>
            <Right><Text note>{get(section, 'distance', 0)}</Text></Right>
          </ListItem>
          <ListItem>
            <Left><Text>Duration</Text></Left>
            <Right><Text note>{get(section, 'duration', ' ')}</Text></Right>
          </ListItem>
          <ListItem>
            <Left><Text>Season</Text></Left>
            <View><Text note>{season}</Text></View>
          </ListItem>
        </List>
        <Button fullWidth label="Details" onPress={this.detailsHandler} />
      </SelectedElementView>
    );
  }

}

export default connect()(SelectedSectionView);
