import { useFocusEffect } from '@react-navigation/native';
import type React from 'react';
import type { ElementRef } from 'react';
import { useCallback, useRef } from 'react';
import type {
  HostComponent,
  LayoutRectangle,
  ScrollView,
  View,
} from 'react-native';
import { Platform } from 'react-native';
import type { SoftInputEventData } from 'react-native-avoid-softinput';
import { AvoidSoftInput } from 'react-native-avoid-softinput';

export const measureElement = async (
  element: React.RefObject<View>,
): Promise<LayoutRectangle> => {
  return new Promise((resolve) => {
    element.current?.measure((x, y, width, height) => {
      resolve({ x, y, width, height });
    });
  });
};

export const measureInLayout = async (
  element: React.RefObject<View>,
  layout: ElementRef<HostComponent<unknown>>,
): Promise<LayoutRectangle> => {
  return new Promise((resolve, reject) => {
    element.current?.measureLayout(
      layout,
      (x, y, width, height) => {
        resolve({ x, y, width, height });
      },
      reject,
    );
  });
};

export default function useAvoidKeyboard(ref?: React.RefObject<View>) {
  const scrollView = useRef<ScrollView>(null);

  const onFocusEffect = useCallback(() => {
    AvoidSoftInput.setAdjustResize();
    AvoidSoftInput.setEnabled(true);
    const shownSub = AvoidSoftInput.onSoftInputShown(
      async ({ softInputHeight }: SoftInputEventData) => {
        if (ref?.current && scrollView?.current) {
          const { height: scrollH } = await measureElement(scrollView);
          const { height: achorH, y: anchorT } = await measureInLayout(
            ref,
            scrollView.current,
          );
          const anchorB = anchorT + achorH;
          let delta =
            Platform.OS === 'ios'
              ? anchorB - (scrollH - softInputHeight)
              : anchorB - scrollH;
          delta = Math.max(0, delta);
          scrollView.current?.scrollTo({ y: delta });
        }
      },
    );

    return () => {
      shownSub.remove();
      AvoidSoftInput.setEnabled(false);
      AvoidSoftInput.setDefaultAppSoftInputMode();
    };
  }, [ref]);

  useFocusEffect(onFocusEffect);

  return scrollView;
}
