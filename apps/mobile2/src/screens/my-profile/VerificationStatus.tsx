import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import Icon from '../../components/Icon';
import theme from '../../theme';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginTop: 2,
  },
});

interface InternalProps {
  isVerified: boolean;
  requestVerification?: () => void;
}

function VerificationStatusInternal({
  isVerified,
  requestVerification,
}: InternalProps) {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  const showMenu = useCallback(() => {
    showActionSheetWithOptions(
      {
        title: t('screens:myprofile.verification.menuTitle'),
        message: t('screens:myprofile.verification.menuMessage'),
        options: [
          t('screens:myprofile.verification.requestButton'),
          t('commons:cancel'),
        ],
        cancelButtonIndex: 1,
      },
      (index: number) => {
        if (index === 0 && !!requestVerification) {
          requestVerification();
        }
      },
    );
  }, [showActionSheetWithOptions, t, requestVerification]);

  return (
    <View style={styles.root}>
      <Icon
        style={styles.icon}
        icon={isVerified ? 'check-circle-outline' : 'help-circle-outline'}
        color={isVerified ? theme.colors.enabled : theme.colors.accent}
      />
      <Text>{t(`screens:myprofile.${isVerified ? '' : 'un'}verified`)}</Text>
      {!isVerified && (
        <Button mode="text" compact onPress={showMenu}>
          {t('screens:myprofile.verification.showMenu')}
        </Button>
      )}
    </View>
  );
}

function VerificationStatus() {
  const { me, service } = useAuth();
  const isVerified = !!me && me.verified;
  const requestVerification = useCallback(() => {
    service.requestVerification({ id: me ? me.id : '' }).catch(() => {});
  }, [me, service]);
  return (
    <VerificationStatusInternal
      isVerified={isVerified}
      requestVerification={requestVerification}
    />
  );
}

export default VerificationStatus;
