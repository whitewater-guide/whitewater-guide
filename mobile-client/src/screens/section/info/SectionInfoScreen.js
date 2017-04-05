import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { List, ListItem, Left, Body, Right, Text, Button, Icon } from 'native-base';
import StarRating from 'react-native-star-rating';
import { renderDifficulty } from '../../../commons/utils/TextUtils';
import { arrayToPrettyDMS } from '../../../commons/utils/GeoUtils';
import { Screen } from '../../../components';

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
    const putIn = arrayToPrettyDMS(section.putIn.coordinates);
    const takeOut = arrayToPrettyDMS(section.takeOut.coordinates);
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

          <ListItem>
            <Left><Text>Put-in</Text></Left>
            <View style={{ paddingRight: 12 }}>
              <Text note>{putIn}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button transparent style={{ paddingLeft: 0, paddingRight: 4 }}>
                <Icon name="copy" style={{ color: 'black', fontSize: 21 }} />
              </Button>
              <Button transparent style={{ paddingLeft: 4, paddingRight: 0 }}>
                <Icon name="navigate" style={{ color: 'black', fontSize: 21 }} />
              </Button>
            </View>
          </ListItem>

          <ListItem>
            <Left><Text>Take out</Text></Left>
            <View style={{ paddingRight: 12 }}>
              <Text note>{takeOut}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button transparent style={{ paddingLeft: 0, paddingRight: 4 }}>
                <Icon name="copy" style={{ color: 'black', fontSize: 21 }} />
              </Button>
              <Button transparent style={{ paddingLeft: 4, paddingRight: 0 }}>
                <Icon name="navigate" style={{ color: 'black', fontSize: 21 }} />
              </Button>
            </View>
          </ListItem>

        </List>
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(SectionInfoScreen);
