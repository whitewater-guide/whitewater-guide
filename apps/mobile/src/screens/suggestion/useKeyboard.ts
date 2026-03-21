import { useMemo, useRef } from 'react';
import type { ScrollView } from 'react-native';

export default () => {
  const scroll = useRef<ScrollView | null>(null);
  const handlers = useMemo(
    () => ({
      onDescriptionFocus: () =>
        setTimeout(() => {
          if (scroll.current) {
            scroll.current.scrollToEnd();
          }
        }, 250),
      onCopyrightFocus: () => {
        if (scroll.current) {
          scroll.current.scrollTo({ y: 48 });
        }
      },
    }),
    [scroll],
  );
  return [scroll, handlers] as [typeof scroll, typeof handlers];
};
