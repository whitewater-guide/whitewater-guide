import PropTypes from 'prop-types';
import React from 'react';
import { flattenProp, hoistStatics } from 'recompose';
import { HTMLView, Screen, TabIcon } from '../../../components';

class SectionGuideScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: 'Guide',
    tabBarIcon: () => <TabIcon icon="book" />,
  };

  render() {
    return (
      <Screen>
        <HTMLView value={this.props.section.description} />
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');

export default hoistStatics(container)(SectionGuideScreen);
