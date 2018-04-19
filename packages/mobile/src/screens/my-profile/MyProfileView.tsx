import identity from 'lodash/identity';
import React from 'react';
import { Divider, Subheading } from 'react-native-paper'
import { Paper, RadioDialog, Screen, } from '../../components';
import { LANGUAGE_NAMES, WithT } from '../../i18n';
import { LANGUAGES } from '../../ww-commons';

type Props = WithT;

const labelExtractor = (code: string) => LANGUAGE_NAMES[code];

class MyProfileView extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  onChangeLanguage = (value: string) => console.log(value);

  render() {
    return (
      <Screen noScroll>
        <Paper>
          <Subheading>General</Subheading>
          <Divider />
          <RadioDialog
            handleTitle={'Interface language'}
            value={'en'}
            options={LANGUAGES}
            onChange={this.onChangeLanguage}
            keyExtractor={identity}
            labelExtractor={labelExtractor}
          />
        </Paper>
      </Screen>
    );
  }
}

export default MyProfileView;
