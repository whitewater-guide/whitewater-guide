import React from 'react';
import { useTranslation } from 'react-i18next';
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
  cancelButton: {
    marginRight: theme.margin.half,
  },
});

type Props = InnerProps & OuterProps;

const AuthStep: React.FC<Props> = (props) => {
  const { me, onCancel, onContinue, cancelable = true } = props;
  const [t] = useTranslation();
  return (
    <React.Fragment>
      <Dialog.Content style={styles.dialogContent}>
        {me ? (
          <React.Fragment>
            <UserHeader user={me!} medium={true} padded={false} />
            <Subheading style={styles.subheading}>
              {t('iap:auth.user')}
            </Subheading>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Subheading style={styles.subheading}>
              {t('iap:auth.anon')}
            </Subheading>
            <AnonHeader medium={true} padded={false} />
          </React.Fragment>
        )}
      </Dialog.Content>
      <Dialog.Actions>
        {cancelable && (
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        )}
        <Button mode="contained" onPress={onContinue} disabled={!me}>
          Continue
        </Button>
      </Dialog.Actions>
    </React.Fragment>
  );
};

export default AuthStep;
