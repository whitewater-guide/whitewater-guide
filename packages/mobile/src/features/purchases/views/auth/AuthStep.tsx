import React from 'react';
import { translate, withI18n, WithI18n } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Subheading } from 'react-native-paper';
import { AnonHeader, UserHeader } from '../../../../components';
import theme from '../../../../theme';
import { InnerProps, OuterProps } from './types';

const styles = StyleSheet.create({
  dialogContent: {
    flex: 1,
  },
  subheading: {
    marginBottom: theme.margin.single,
  },
});

type Props = InnerProps & OuterProps & WithI18n;

class AuthStep extends React.PureComponent<Props> {
  renderAnon = () => (
    <React.Fragment>
      <Subheading style={styles.subheading}>
        {this.props.t('iap:auth.anon')}
      </Subheading>
      <AnonHeader medium padded={false} />
    </React.Fragment>
  );

  renderUser = () => (
    <React.Fragment>
      <UserHeader user={this.props.me!} medium padded={false} />
      <Subheading style={styles.subheading}>
        {this.props.t('iap:auth.user')}
      </Subheading>
    </React.Fragment>
  );

  render() {
    const { me, onCancel, onContinue, cancelable = true } = this.props;
    return (
      <React.Fragment>
        <Dialog.Content style={styles.dialogContent}>
          {
            me ? this.renderUser() : this.renderAnon()
          }
        </Dialog.Content>
        <Dialog.Actions>
          {
            cancelable &&
            (
              <Button mode="outlined" onPress={onCancel}>Cancel</Button>
            )
          }
          <Button mode="contained" onPress={onContinue} disabled={!me}>
            Continue
          </Button>
        </Dialog.Actions>
      </React.Fragment>
    );
  }
}

export default withI18n()(AuthStep);
