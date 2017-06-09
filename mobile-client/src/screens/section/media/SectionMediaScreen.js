import PropTypes from 'prop-types';
import React from 'react';
import { flattenProp, hoistStatics } from 'recompose';
import { List } from 'native-base';
import { Screen, TabIcon } from '../../../components';
import MediaItem from './MediaItem';

class SectionMediaScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: 'Media',
    tabBarIcon: () => <TabIcon icon="photos" />,
  };

  renderRow = item => <MediaItem data={item} />;

  render() {
    const { section } = this.props;
    return (
      <Screen>
        <List dataArray={section.media} renderRow={this.renderRow} />
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');
export default hoistStatics(container)(SectionMediaScreen);
