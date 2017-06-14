import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { capitalize } from 'lodash';
import moment from 'moment';
import { WhitePortal } from 'react-native-portal';
import { Link, ListItem, Left, Right, Text, Icon } from '../../../components';


export default class GaugeInfo extends React.PureComponent {

  static propTypes = {
    gauge: PropTypes.object,
  };

  render() {
    const { gauge } = this.props;
    const { name, lastTimestamp } = gauge;
    const isOutdated = moment().diff(lastTimestamp, 'days') > 1;
    return (
      <View>

        <ListItem>
          <Left><Text>Gauge</Text></Left>
          <Right>
            <Link label={capitalize(name)} url={gauge.url} />
          </Right>
        </ListItem>

        <WhitePortal name="chartPortal" />

        <ListItem>
          <Left><Text>Last updated</Text></Left>
          <Right flexDirection="row">
            <Text note>{moment(lastTimestamp).format('HH:mm DD MMMM YYYY')}</Text>
            { isOutdated && <Icon narrow icon="warning" size={16} /> }
          </Right>
        </ListItem>

      </View>
    );
  }

}
