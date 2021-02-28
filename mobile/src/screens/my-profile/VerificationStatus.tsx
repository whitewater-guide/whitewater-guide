import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';

import Icon from '~/components/Icon';
import Spacer from '~/components/Spacer';
import theme from '~/theme';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginTop: 2,
  },
});

interface Props {
  isVerified: boolean;
  requestVerification?: () => void;
}

export const VerificationStatusInternal: React.FC<Props> = ({
  isVerified,
  requestVerification,
}) => {
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
      <Paragraph>
        {t(`screens:myprofile.${isVerified ? '' : 'un'}verified`)}
      </Paragraph>
      <Spacer />
      {!isVerified && (
        <React.Fragment>
          <Button mode="text" compact={true} onPress={showMenu}>
            {t('screens:myprofile.verification.showMenu')}
          </Button>
        </React.Fragment>
      )}
    </View>
  );
};

const VerificationStatus: React.FC = () => {
  const { me, service } = useAuth();
  const isVerified = !!me && me.verified;
  const requestVerification = useCallback(() => {
    service.requestVerification({ id: me ? me.id : '' }).catch(() => {
      // ignore
    });
  }, [me, service]);
  return (
    <VerificationStatusInternal
      isVerified={isVerified}
      requestVerification={requestVerification}
    />
  );
};

VerificationStatus.displayName = 'VerificationStatus';

export default VerificationStatus;
