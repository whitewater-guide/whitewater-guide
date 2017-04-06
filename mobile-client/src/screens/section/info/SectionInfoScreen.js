import React, { PropTypes } from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { List, ListItem, Left, Body, Right, Text } from 'native-base';
import StarRating from 'react-native-star-rating';
import { renderDifficulty } from '../../../commons/utils/TextUtils';
import { Screen } from '../../../components';
import CoordinatesInfo from './CoordinatesInfo';

class SectionInfoScreen extends React.PureComponent {

  static propTypes = {
    screenProps: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Info',
    },
  };

  render() {
    const { screenProps: { section = { river: {} }, sectionLoading } } = this.props;
    return (
      <Screen loading={sectionLoading}>
        <List>

          <ListItem>
            <Left><Text>Difficulty</Text></Left>
            <Right><Text note>{renderDifficulty(section)}</Text></Right>
          </ListItem>

          <ListItem>
            <Left><Text>Rating</Text></Left>
            <Right>
              <StarRating disabled rating={section.rating} starSize={14} starColor={'#a7a7a7'} />
            </Right>
          </ListItem>

          <ListItem>
            <Left><Text>Drop</Text></Left>
            <Right><Text note>{section.drop}</Text></Right>
          </ListItem>

          <ListItem>
            <Left><Text>Length, km</Text></Left>
            <Right><Text note>{section.distance}</Text></Right>
          </ListItem>

          <ListItem>
            <Left><Text>Duration</Text></Left>
            <Right><Text note>{section.duration}</Text></Right>
          </ListItem>

          <ListItem>
            <Left><Text>Season</Text></Left>
            <Body><Text note>{section.season}</Text></Body>
          </ListItem>

          <CoordinatesInfo label="Put-in" coordinates={section.putIn.coordinates} />

          <CoordinatesInfo label="Take-out" coordinates={section.takeOut.coordinates} />

        </List>
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(SectionInfoScreen);
