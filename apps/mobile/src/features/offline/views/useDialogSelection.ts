import { useCallback, useState } from 'react';

import type { OfflineCategorySelection, OfflineCategoryType } from '../types';

type Hook = [
  OfflineCategorySelection,
  (type: OfflineCategoryType, value: boolean) => void,
];

export default (): Hook => {
  const [selection, setSelection] = useState<OfflineCategorySelection>({
    data: true,
    media: false,
    maps: false,
  });
  const toggleCategory = useCallback(
    (type: OfflineCategoryType, value: boolean) => {
      setSelection({ ...selection, [type]: value });
    },
    [selection, setSelection],
  );
  return [selection, toggleCategory];
};
