import React, { PropTypes } from 'react';
import { Text } from 'native-base';
import { flattenProp, hoistStatics } from 'recompose';
import { Screen } from '../../../components';
import TabIcon from './TabIcon';

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

  render() {
    const { section } = this.props;
    return (
      <Screen>
        <Text>{JSON.stringify(section.media)}</Text>
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');
export default hoistStatics(container)(SectionMediaScreen);
