import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { flattenProp, hoistStatics } from 'recompose';
import { capitalize, trim, isNil } from 'lodash';
import { renderDifficulty } from '../../../commons/utils/TextUtils';
import stringifySeason from '../../../commons/utils/stringifySeason';
import { durationToString } from '../../../commons/domain';
import { Chips, Screen, StarRating, TabIcon, ListItem, Left, Right, Text } from '../../../components';
import CoordinatesInfo from './CoordinatesInfo';

class SectionInfoScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: 'Info',
    tabBarIcon: () => <TabIcon icon="information-circle" />,
  };

  render() {
    const { section } = this.props;
    const season = capitalize(trim(`${stringifySeason(section.seasonNumeric)}\n${section.season}`));
    return (
      <Screen>
        <View>

          <ListItem>
            <Left><Text>Difficulty</Text></Left>
            <Right><Text note>{renderDifficulty(section)}</Text></Right>
          </ListItem>

          <ListItem>
            <Left><Text>Rating</Text></Left>
            <Right>
              <StarRating value={section.rating} />
            </Right>
          </ListItem>

          <ListItem>
            <Left><Text>Drop, m</Text></Left>
            <Right><Text note>{section.drop}</Text></Right>
          </ListItem>

          <ListItem>
            <Left><Text>Length, km</Text></Left>
            <Right><Text note>{section.distance}</Text></Right>
          </ListItem>

          {
            !isNil(section.duration) &&
            <ListItem>
              <Left><Text>Duration</Text></Left>
              <Right><Text note>{durationToString(section.duration)}</Text></Right>
            </ListItem>
          }

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

        </View>
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');
export default hoistStatics(container)(SectionInfoScreen);
