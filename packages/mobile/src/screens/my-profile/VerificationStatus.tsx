import { useAuth } from '@whitewater-guide/clients';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Button, Paragraph } from 'react-native-paper';
import { Icon, Spacer } from '../../components';
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

interface Props {
  isVerified: boolean;
  requestVerification?: () => void;
}

export const VerificationStatusInternal: React.FC<Props> = ({
  isVerified,
  requestVerification,
}) => {
  const { t } = useTranslation();
  const actionSheet = useRef<ActionSheet>(null);
  const trans = t(
    `screens:myprofile.${isVerified ? 'verified' : 'unverified'}`,
  );
  const showMenu = useCallback(() => {
    if (actionSheet.current) {
      actionSheet.current.show();
    }
  }, []);
  const onMenu = useCallback(
    (index: number) => {
      if (index === 0 && !!requestVerification) {
        requestVerification();
      }
    },
    [requestVerification],
  );
  const options = useMemo(
    () => [
      t('screens:myprofile.verification.requestButton'),
      t('commons:cancel'),
    ],
    [t],
  );
  return (
    <View style={styles.root}>
      <Icon
        style={styles.icon}
        icon={isVerified ? 'check-circle-outline' : 'help-circle-outline'}
        color={isVerified ? theme.colors.enabled : theme.colors.accent}
      />
      <Paragraph>{trans}</Paragraph>
      <Spacer />
      {!isVerified && (
        <React.Fragment>
          <Button mode="text" compact={true} onPress={showMenu}>
            {t('screens:myprofile.verification.showMenu')}
          </Button>
          <ActionSheet
            ref={actionSheet}
            title={t('screens:myprofile.verification.menuTitle')}
            message={t('screens:myprofile.verification.menuMessage')}
            options={options}
            cancelButtonIndex={1}
            destructiveButtonIndex={1}
            onPress={onMenu}
          />
        </React.Fragment>
      )}
    </View>
  );
};

const VerificationStatus: React.FC = () => {
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
};

VerificationStatus.displayName = 'VerificationStatus';

export default VerificationStatus;
