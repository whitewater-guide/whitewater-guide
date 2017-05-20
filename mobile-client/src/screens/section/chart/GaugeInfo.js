import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, ListItem, Left, Right, Body, Text, Icon } from 'native-base';
import { capitalize } from 'lodash';
import moment from 'moment';

const styles = StyleSheet.create({
  timestampRow: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default class GaugeInfo extends React.PureComponent {

  static propTypes = {
    gauge: PropTypes.object,
  };

  render() {
    const { gauge } = this.props;
    const { name, lastTimestamp, lastLevel, lastFlow, levelUnit, flowUnit } = gauge;
    const isOutdated = moment().diff(lastTimestamp, 'days') > 1;
    return (
      <List>

        <ListItem>
          <Left><Text>Gauge</Text></Left>
          <Right><Text note>{capitalize(name)}</Text></Right>
        </ListItem>

        <ListItem>
          <Left><Text>Last updated</Text></Left>
          <View style={styles.timestampRow}>
            <Text note>{moment(lastTimestamp).format('HH:mm DD MMMM YYYY')}</Text>
            { isOutdated && <Icon name="warning" style={{ fontSize: 16 }} /> }
          </View>
        </ListItem>

        {
          !!flowUnit &&
          <ListItem>
            <Left><Text>Last recorded flow</Text></Left>
            <Right><Text note>{ `${lastFlow.toFixed(2)} ${flowUnit}`}</Text></Right>
          </ListItem>
        }

        {
          !!levelUnit &&
          <ListItem>
            <Left><Text>Last recorded level</Text></Left>
            <Right><Text note>{`${lastLevel.toFixed(2)} ${levelUnit}`}</Text></Right>
          </ListItem>
        }

      </List>
    );
  }

}
