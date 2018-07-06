import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, DialogActions, DialogContent, DialogTitle, Subheading } from 'react-native-paper';
import theme from '../../theme';
import { User } from '../../ww-commons';
import AnonHeader from '../AnonHeader';
import UserHeader from '../UserHeader';
import { PremiumRegion } from './types';

const styles = StyleSheet.create({
  subheading: {
    marginBottom: theme.margin.single,
  },
});

interface Props {
  region: PremiumRegion;
  me: Pick<User, 'name' | 'avatar'> | null;
  onContinue?: () => void;
  onCancel?: () => void;
}

export class AuthStep extends React.PureComponent<Props> {
  renderAnon = () => (
    <React.Fragment>
      <Subheading style={styles.subheading}>Please authenticate to proceed to purchase</Subheading>
      <AnonHeader />
    </React.Fragment>
  );

  renderUser = () => (
    <React.Fragment>
      <UserHeader user={this.props.me} />
      <Subheading style={styles.subheading}>Success! Please continue to your purchase</Subheading>
    </React.Fragment>
  );

  render() {
    const { region, me, onCancel, onContinue } = this.props;
    return (
      <React.Fragment>
        <DialogTitle>{region.name}</DialogTitle>
        <DialogContent>
          {
            me ? this.renderUser() : this.renderAnon()
          }
        </DialogContent>
        <DialogActions>
          <Button raised onPress={onCancel}>Cancel</Button>
          <Button primary raised onPress={onContinue} disabled={!me}>
            Continue
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}
