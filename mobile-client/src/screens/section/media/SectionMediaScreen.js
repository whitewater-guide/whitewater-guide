import React, { PropTypes } from 'react';
import { Text } from 'native-base';
import { flattenProp, hoistStatics } from 'recompose';
import { Screen } from '../../../components';

class SectionMediaScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Media',
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
