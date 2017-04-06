import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { List, ListItem, Left, Right, Text } from 'native-base';
import StarRating from 'react-native-star-rating';
import { capitalize, trim } from 'lodash';
import { renderDifficulty } from '../../../commons/utils/TextUtils';
import stringifySeason from '../../../commons/utils/stringifySeason';
import { Chips, Screen } from '../../../components';
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
    const { screenProps: { section, sectionLoading } } = this.props;
    if (!section) {
      return null;
    }
    const season = capitalize(trim(`${stringifySeason(section.seasonNumeric)}\n${section.season}`));
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
            <View><Text note>{season}</Text></View>
          </ListItem>

          <CoordinatesInfo label="Put-in" coordinates={section.putIn.coordinates} />

          <CoordinatesInfo label="Take-out" coordinates={section.takeOut.coordinates} />

          <ListItem>
            <Left><Text>Supply</Text></Left>
            <View style={{ flex: 3 }}>
              <Chips values={section.supplyTags.map(t => t.name)} color="blue" />
            </View>
          </ListItem>

          <ListItem>
            <Left><Text>Hazards</Text></Left>
            <View style={{ flex: 3 }}>
              <Chips values={section.hazardsTags.map(t => t.name)} color="red" />
            </View>
          </ListItem>

          <ListItem>
            <Left><Text>Kayaking types</Text></Left>
            <View style={{ flex: 3 }}>
              <Chips values={section.kayakingTags.map(t => t.name)} color="green" />
            </View>
          </ListItem>

          <ListItem>
            <Left><Text>Tags</Text></Left>
            <View style={{ flex: 3 }}>
              <Chips values={section.miscTags.map(t => t.name)} color="#444444" />
            </View>
          </ListItem>

        </List>
      </Screen>
    );
  }

}

export default connect(undefined, NavigationActions)(SectionInfoScreen);
