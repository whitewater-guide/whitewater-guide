import Icon from 'components/Icon';
import React, { useCallback } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import theme from '../../../theme';

interface Props {
  disabled?: boolean;
}

const CloseButton: React.FC<Props> = React.memo(({ disabled }) => {
  const { goBack } = useNavigation();
  const onPress = useCallback(() => {
    goBack(null);
  }, [goBack]);
  return (
    <Icon
      icon="close"
      onPress={disabled ? undefined : onPress}
      color={disabled ? theme.colors.componentBorder : theme.colors.primary}
      testID="purchase-buy-close-btn"
    />
  );
});

CloseButton.displayName = 'CloseButton';

export default CloseButton;
