import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Subheading } from 'react-native-paper';
import theme from '../../../../theme';
import { PremiumRegion } from '../../types';

const styles = StyleSheet.create({
  dialogContent: {
    flex: 1,
  },
  subheading: {
    marginBottom: theme.margin.single,
  },
});

interface Props {
  region: PremiumRegion;
  onCancel?: () => void;
}

const AlreadyHaveStep: React.FC<Props> = ({ onCancel, region }) => {
  const [t] = useTranslation();
  return (
    <React.Fragment>
      <Dialog.Content style={styles.dialogContent}>
        <Subheading style={styles.subheading}>
          {t('iap:alreadyHave.message', { region: region.name })}
        </Subheading>
      </Dialog.Content>
      <Dialog.Actions>
        <Button mode="contained" onPress={onCancel}>
          {t('commons:ok')}
        </Button>
      </Dialog.Actions>
    </React.Fragment>
  );
};

export default AlreadyHaveStep;
