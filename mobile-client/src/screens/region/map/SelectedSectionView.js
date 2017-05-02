import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View, Button } from 'react-native';
import { List, ListItem, Left, Right, Text } from 'native-base';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import StarRating from 'react-native-star-rating';
import { get, capitalize, trim } from 'lodash';
import { SectionPropType } from '../../../commons/features/sections';
import stringifySeason from '../../../commons/utils/stringifySeason';
import { DifficultyThumb, NavigateButton } from '../../../components';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
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
    dispatch: PropTypes.func.isRequired,
    slideAnimated: PropTypes.any,
  };
  
  static defaultProps = {
    selectedSection: null,
    slideAnimated: new Animated.Value(0),
  };
  
  // TODO: this causes overlapping maps until https://github.com/airbnb/react-native-maps/issues/1161 gets fixed
  detailsHandler = () => {
    this.props.dispatch(NavigationActions.navigate({
      routeName: 'SectionDetails',
      params: { sectionId: this.props.selectedSection._id },
    }));
  };
  
  render() {
    const { selectedSection: section, slideAnimated } = this.props;
    const season = section ? capitalize(trim(`${stringifySeason(section.seasonNumeric)}\n${section.season}`)) : ' ';
    return (
      <View>
        <View style={styles.header}>
          <View style={styles.body}>
            <Text>{get(section, 'river.name', '_')}</Text>
            <Text>{get(section, 'name', '_')}</Text>
            <View style={styles.starsContainer}>
              <StarRating disabled rating={get(section, 'rating', 0)} starSize={14} starColor={'#a7a7a7'}/>
            </View>
          </View>
          <DifficultyThumb
            difficulty={get(section, 'difficulty', 1)}
            difficultyXtra={get(section, 'difficultyXtra', '_')}
            noBorder
          />
          <NavigateButton
            label="Put-in"
            driver={slideAnimated}
            inputRange={[96, 66]}
            coordinates={get(section, 'putIn.coordinates', [0,0])}
          />
          <NavigateButton
            label="Take-out"
            driver={slideAnimated}
            inputRange={[66, 33]}
            coordinates={get(section, 'takeOut.coordinates', [0,0])}
          />
        </View>
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
        <Button onPress={this.detailsHandler} title="Details"/>
      </View>
    );
  };
}

export default connect()(SelectedSectionView);
