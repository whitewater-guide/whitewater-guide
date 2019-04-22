import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Paragraph, Subheading } from 'react-native-paper';
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
  onComplete?: () => void;
}

const SuccessStep: React.FC<Props> = ({ region, onComplete }) => {
  const [t] = useTranslation();
  return (
    <React.Fragment>
      <Dialog.Content style={styles.dialogContent}>
        <Subheading style={styles.subheading}>
          {t('iap:success.subheading')}
        </Subheading>
        <Paragraph>{t('iap:success.body', { region: region.name })}</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button mode="contained" onPress={onComplete}>
          {t('commons:ok')}
        </Button>
      </Dialog.Actions>
    </React.Fragment>
  );
};

export default SuccessStep;
