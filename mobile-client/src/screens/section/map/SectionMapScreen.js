import React, { PropTypes } from 'react';
import { Text } from 'native-base';
import { flattenProp } from 'recompose';
import { Screen } from '../../../components';

class SectionMapScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBar: {
      label: 'Map',
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

export default flattenProp('screenProps')(SectionMapScreen);
