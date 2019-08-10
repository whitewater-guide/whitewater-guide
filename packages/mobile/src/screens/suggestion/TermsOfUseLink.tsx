import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Caption } from 'react-native-paper';
import theme from '../../theme';
import Screens from '../screen-names';

const styles = StyleSheet.create({
  link: {
    color: theme.colors.primary,
  },
});

const TermsOfUseLink: React.FC = React.memo(() => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const onPress = useCallback(() => {
    navigate(Screens.Plain, {
      fixture: 'termsAndConditions',
      title: t('commons:termsOfService'),
    });
  }, [navigate]);

  return (
    <Caption style={styles.link} onPress={onPress}>
      {t('screens:suggestion.termsOfUse')}
    </Caption>
  );
});

TermsOfUseLink.displayName = 'TermsOfUseLink';

export default TermsOfUseLink;
