import { StackHeaderProps } from '@react-navigation/stack';
import noop from 'lodash/noop';
import { useMemo } from 'react';

import theme from '~/theme';

export default (scene: StackHeaderProps['scene']) => {
  return useMemo(() => {
    const titleProp = scene.descriptor.options.headerTitle;
    const headerLeftProp = scene.descriptor.options.headerLeft;
    const headerRightProp = scene.descriptor.options.headerRight;
    const headerTintColor =
      scene.descriptor.options.headerTintColor || theme.colors.textLight;

    const title =
      typeof titleProp === 'function'
        ? titleProp({
            tintColor: headerTintColor,
            onLayout: noop,
          })
        : titleProp;

    const headerLeft = headerLeftProp
      ? headerLeftProp({
          tintColor: headerTintColor,
        })
      : undefined;

    const headerRight = headerRightProp
      ? headerRightProp({
          tintColor: headerTintColor,
        })
      : undefined;
    return {
      headerLeft,
      headerRight,
      title,
    };
  }, [scene]);
};
