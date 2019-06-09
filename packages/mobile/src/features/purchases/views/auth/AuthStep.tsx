import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import theme from '../../../../theme';
import AuthStepAnon from './AuthStepAnon';
import AuthStepUnverified from './AuthStepUnverified';
import AuthStepVerified from './AuthStepVerified';
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
  return (
    <React.Fragment>
      <Dialog.Content style={styles.dialogContent}>
        {me ? (
          me.verified ? (
            <AuthStepVerified me={me} />
          ) : (
            <AuthStepUnverified me={me} />
          )
        ) : (
          <AuthStepAnon onCancel={onCancel} />
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
        <Button
          mode="contained"
          onPress={onContinue}
          disabled={!me || !me.verified}
        >
          Continue
        </Button>
      </Dialog.Actions>
    </React.Fragment>
  );
};

export default AuthStep;
