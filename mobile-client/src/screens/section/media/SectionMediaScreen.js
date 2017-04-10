import React, { PropTypes } from 'react';
import { flattenProp, hoistStatics } from 'recompose';
import { List } from 'native-base';
import { Screen } from '../../../components';
import TabIcon from './TabIcon';
import MediaItem from './MediaItem';

class SectionMediaScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Media',
      icon: () => <TabIcon icon="photos" />,
    },
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
