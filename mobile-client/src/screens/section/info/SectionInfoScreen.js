import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { flattenProp, hoistStatics } from 'recompose';
import { capitalize, trim, isNil } from 'lodash';
import { renderDifficulty } from '../../../commons/utils/TextUtils';
import stringifySeason from '../../../commons/utils/stringifySeason';
import { durationToString } from '../../../commons/domain';
import { Chips, Screen, StarRating, TabIcon, ListItem, Left, Body, Right, Text } from '../../../components';
import CoordinatesInfo from './CoordinatesInfo';
import I18n from '../../../i18n';

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
    let season = capitalize(trim(`${stringifySeason(section.seasonNumeric, false, I18n.t('locale'))}`));
    if (section.season) {
      season = `${season}\n${section.season}`;
    }
    return (
      <Screen>
        <View>

          <ListItem>
            <Left><Text>{I18n.t('commons.difficulty')}</Text></Left>
            <Right><Text note>{renderDifficulty(section)}</Text></Right>
          </ListItem>

          <ListItem>
            <Left><Text>{I18n.t('commons.rating')}</Text></Left>
            <Right>
              <StarRating value={section.rating} />
            </Right>
          </ListItem>

          <ListItem>
            <Left><Text>{I18n.t('commons.drop')}</Text></Left>
            <Right><Text note>{`${section.drop} ${I18n.t('commons.m')}`}</Text></Right>
          </ListItem>

          <ListItem>
            <Left><Text>{I18n.t('commons.length')}</Text></Left>
            <Right><Text note>{`${section.distance} ${I18n.t('commons.km')}`}</Text></Right>
          </ListItem>

          {
            !isNil(section.duration) &&
            <ListItem>
              <Left><Text>{I18n.t('commons.duration')}</Text></Left>
              <Right><Text note>{I18n.t('durations.'+durationToString(section.duration))}</Text></Right>
            </ListItem>
          }

          {
            section.flowsText &&
            <ListItem>
              <Left><Text>{I18n.t('commons.flows')}</Text></Left>
              <Body>
              <Text note right>{section.flowsText}</Text>
              </Body>
            </ListItem>
          }

          <ListItem>
            <Left><Text>{I18n.t('commons.season')}</Text></Left>
            <Body>
            <Text note right>{season}</Text>
            </Body>
          </ListItem>

          <CoordinatesInfo label={I18n.t('commons.putIn')} coordinates={section.putIn.coordinates} />

          <CoordinatesInfo label={I18n.t('commons.takeOut')} coordinates={section.takeOut.coordinates} />

          <ListItem>
            <Left><Text>{I18n.t('commons.supplyTypes')}</Text></Left>
            <View style={{ flex: 3 }}>
              <Chips values={section.supplyTags.map(t => I18n.t(`supply.${t.name}`))} color="blue" />
            </View>
          </ListItem>

          <ListItem>
            <Left><Text>{I18n.t('commons.hazards')}</Text></Left>
            <View style={{ flex: 3 }}>
              <Chips values={section.hazardsTags.map(t => I18n.t(`hazards.${t.name}`))} color="red" />
            </View>
          </ListItem>

          <ListItem>
            <Left><Text>{I18n.t('commons.kayakingTypes')}</Text></Left>
            <View style={{ flex: 3 }}>
              <Chips values={section.kayakingTags.map(t => I18n.t(`kayakingTypes.${t.name}`))} color="green" />
            </View>
          </ListItem>

          <ListItem>
            <Left><Text>{I18n.t('commons.miscTags')}</Text></Left>
            <View style={{ flex: 3 }}>
              <Chips values={section.miscTags.map(t => I18n.t(`miscTags.${t.name}`))} color="#444444" />
            </View>
          </ListItem>

        </View>
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');
export default hoistStatics(container)(SectionInfoScreen);
