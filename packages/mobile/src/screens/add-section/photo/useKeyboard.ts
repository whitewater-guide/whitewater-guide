import { useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';

export default () => {
  const scroll = useRef<ScrollView | null>(null);
  const handlers = useMemo(
    () => ({
      onDescriptionFocus: () =>
        setTimeout(() => {
          scroll.current?.scrollToEnd();
        }, 200),
      onCopyrightFocus: () => {
        scroll.current?.scrollTo({ y: 48 });
      },
    }),
    [scroll],
  );
  return [scroll, handlers] as const;
};
