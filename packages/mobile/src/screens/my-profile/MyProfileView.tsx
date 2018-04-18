import React from 'react';
import { Screen, Text } from '../../components';
import { WithT } from '../../i18n';

type Props = WithT;

class MyProfileView extends React.PureComponent<Props> {
  render() {
    return (
      <Screen noScroll>
        <Text>My profile</Text>
      </Screen>
    );
  }
}

export default MyProfileView;
