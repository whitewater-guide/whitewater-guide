import React from 'react';
import ModalSelector from 'react-native-modal-selector'
import { Screen, Text } from '../../components';
import { WithT } from '../../i18n';
import { LANGUAGES } from '../../ww-commons';

type Props = WithT;

const keyExtractor = (v: string) => v;

class MyProfileView extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  labelExtractor = (code: string) => this.props.t(`languages:${code}`);

  onChangeLanguage = (value: string) => console.log(value);

  render() {
    return (
      <Screen noScroll>
        <Text>My profile</Text>
        <ModalSelector
          data={LANGUAGES}
          initValue='en'
          keyExtractor={keyExtractor}
          labelExtractor={this.labelExtractor}
          onChange={this.onChangeLanguage}
        />
      </Screen>
    );
  }
}

export default MyProfileView;
