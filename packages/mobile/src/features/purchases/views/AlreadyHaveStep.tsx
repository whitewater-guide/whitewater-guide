import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, DialogActions, DialogContent, Subheading } from 'react-native-paper';
import theme from '../../theme';
import { PremiumRegion } from './types';

const styles = StyleSheet.create({
  subheading: {
    marginBottom: theme.margin.single,
  },
});

interface Props {
  region: PremiumRegion;
  onCancel?: () => void;
}

export class AlreadyHaveStep extends React.PureComponent<Props> {

  render() {
    const { onCancel } = this.props;
    return (
      <React.Fragment>
        <DialogContent>
          <Subheading style={styles.subheading}>
            It seems that you already have premium access to this region
          </Subheading>
        </DialogContent>
        <DialogActions>
          <Button primary raised onPress={onCancel}>
            OK
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}
