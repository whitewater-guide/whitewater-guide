import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import Icon from '~/components/Icon';
import theme from '~/theme';
import { PurchaseBuyNavProp } from './types';

interface Props {
  disabled?: boolean;
}

const CloseButton: React.FC<Props> = React.memo(({ disabled }) => {
  const navigation = useNavigation<PurchaseBuyNavProp>();
  const onPress = useCallback(() => {
    navigation.dangerouslyGetParent()?.goBack();
  }, [navigation]);
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
