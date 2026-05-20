import { useMemo, useRef } from 'react';
import type { ScrollView } from 'react-native';

export default () => {
  const scroll = useRef<ScrollView | null>(null);
  const handlers = useMemo(
    () => ({
      onDescriptionFocus: () =>
        setTimeout(() => {
          scroll.current?.scrollToEnd();
        }, 250),
      onCopyrightFocus: () => {
        scroll.current?.scrollTo({ y: 48 });
      },
    }),
    [],
  );
  return [scroll, handlers] as [typeof scroll, typeof handlers];
};
