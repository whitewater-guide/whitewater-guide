import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonProps, PartialIconProps } from 'react-native-paper';
import MDCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { Omit } from 'type-zoo';
import theme from '../../../theme';

type Props = Omit<ButtonProps, 'children'>;

export const FacebookButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const renderIcon = useCallback(
    ({ size, color }: PartialIconProps) => (
      <MDCommunity
        name="facebook-box"
        size={2 * size}
        color={color}
        style={{ width: 2 * size }}
      />
    ),
    [],
  );
  return (
    <Button
      mode="contained"
      color={theme.colors.facebook}
      icon={renderIcon}
      {...props}
    >
      {' ' + t('screens:auth.signin.facebook')}
    </Button>
  );
};
