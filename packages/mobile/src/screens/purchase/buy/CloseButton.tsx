import Icon from 'components/Icon';
import React, { useCallback } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import theme from '../../../theme';

const CloseButton: React.FC = React.memo(() => {
  const { goBack } = useNavigation();
  const onPress = useCallback(() => {
    goBack(null);
  }, [goBack]);
  return <Icon icon="close" onPress={onPress} color={theme.colors.primary} />;
});

CloseButton.displayName = 'CloseButton';

export default CloseButton;
