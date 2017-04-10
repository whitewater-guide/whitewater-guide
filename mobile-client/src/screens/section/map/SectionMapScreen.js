import React, { PropTypes } from 'react';
import { Text } from 'native-base';
import { flattenProp, hoistStatics } from 'recompose';
import { Screen, TabIcon } from '../../../components';

class SectionMapScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Map',
      icon: () => <TabIcon icon="map" />,
    },
  };

  render() {
    const { section } = this.props;
    return (
      <Screen >
        <Text>{`Section Map ${section.river.name} - ${section.name}`}</Text>
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');
export default hoistStatics(container)(SectionMapScreen);
