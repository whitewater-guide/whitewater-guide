import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, DialogActions, DialogContent, Subheading } from 'react-native-paper';
import { AnonHeader, UserHeader } from '../../../components';
import { WithT } from '../../../i18n';
import theme from '../../../theme';
import { User } from '../../../ww-commons';
import { PremiumRegion } from './types';

const styles = StyleSheet.create({
  subheading: {
    marginBottom: theme.margin.single,
  },
});

interface Props extends WithT {
  region: PremiumRegion;
  me: Pick<User, 'name' | 'avatar'> | null;
  onContinue?: () => void;
  onCancel?: () => void;
  cancelable?: boolean;
}

class AuthStep extends React.PureComponent<Props> {
  renderAnon = () => (
    <React.Fragment>
      <Subheading style={styles.subheading}>
        {this.props.t('iap:auth.anon')}
      </Subheading>
      <AnonHeader />
    </React.Fragment>
  );

  renderUser = () => (
    <React.Fragment>
      <UserHeader user={this.props.me} />
      <Subheading style={styles.subheading}>
        {this.props.t('iap:auth.user')}
      </Subheading>
    </React.Fragment>
  );

  render() {
    const { me, onCancel, onContinue, cancelable } = this.props;
    return (
      <React.Fragment>
        <DialogContent>
          {
            me ? this.renderUser() : this.renderAnon()
          }
        </DialogContent>
        <DialogActions>
          {
            !cancelable &&
            (
              <Button raised onPress={onCancel}>Cancel</Button>
            )
          }
          <Button primary raised onPress={onContinue} disabled={!me}>
            Continue
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

export default translate()(AuthStep);
