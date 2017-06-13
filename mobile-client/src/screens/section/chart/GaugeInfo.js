import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { capitalize } from 'lodash';
import moment from 'moment';
import { Link, ListItem, Left, Right, Text, IonIcon } from '../../../components';

export default class GaugeInfo extends React.PureComponent {

  static propTypes = {
    gauge: PropTypes.object,
  };

  render() {
    const { gauge } = this.props;
    const { name, lastTimestamp, lastLevel, lastFlow, levelUnit, flowUnit } = gauge;
    const isOutdated = moment().diff(lastTimestamp, 'days') > 1;
    return (
      <View>

        <ListItem>
          <Left><Text>Gauge</Text></Left>
          <Right>
            <Link label={capitalize(name)} url={gauge.url} />
          </Right>
        </ListItem>

        <ListItem>
          <Left><Text>Last updated</Text></Left>
          <Right flexDirection="row">
            <Text note>{moment(lastTimestamp).format('HH:mm DD MMMM YYYY')}</Text>
            { isOutdated && <IonIcon name="warning" size={16} /> }
          </Right>
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

      </View>
    );
  }

}
