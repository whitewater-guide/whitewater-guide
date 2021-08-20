import { StackNavigationOptions } from '@react-navigation/stack';
import noop from 'lodash/noop';
import { useMemo } from 'react';

import theme from '~/theme';

export default (options: StackNavigationOptions) =>
  useMemo(() => {
    const titleProp = options.headerTitle;
    const headerLeftProp = options.headerLeft;
    const headerRightProp = options.headerRight;
    const headerTintColor = options.headerTintColor || theme.colors.textLight;

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
  }, [options]);
