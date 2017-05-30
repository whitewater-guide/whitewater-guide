import PropTypes from 'prop-types';
import React from 'react';
import { flattenProp, hoistStatics } from 'recompose';
import { HTMLView, Screen, TabIcon } from '../../../components';
import NoGuide from './NoGuide';

class SectionGuideScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
  };

  static navigationOptions = {
    tabBarLabel: 'Guide',
    tabBarIcon: () => <TabIcon icon="book" />,
  };

  render() {
    const { description } = this.props.section;
    return (
      <Screen noScroll={!description}>
        {
          description ?
            <HTMLView value={description} /> :
            <NoGuide />
        }
      </Screen>
    );
  }

}

const container = flattenProp('screenProps');

export default hoistStatics(container)(SectionGuideScreen);
